package actions

import (
	"dt_service/models"
	"dt_service/utils"

	"encoding/json"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
)

type dataFilterAdviser struct { // estructura que contendrá la data  para filtrado
	AdviserName string `json:"adviser_name" form:"adviser_name"`
}

type rowAdviser struct {
	ID       uuid.UUID `json:"id" db:"id"`
	Name     string    `json:"name" db:"name"`
	LastName string    `json:"last_name" db:"last_name"`
}

type listAdvisers []rowAdviser

func AdviserAdviserFilter(c buffalo.Context) error {
	dataFilter := &dataFilterAdviser{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFilter); err != nil {
		return c.Render(200, r.JSON(false))
	}

	txtQuery := utils.GetWhereInArrayTxt("advisers.name", "advisers.last_name", dataFilter.AdviserName)

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	authors := &listAdvisers{}
	query := tx.RawQuery("SELECT id, advisers.name, advisers.last_name FROM advisers " +
		"WHERE " + txtQuery + " LIMIT 8")
	if err := query.All(authors); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(authors))
}

func CreateAdviserAsync(c buffalo.Context) error {
	type personAdviser struct {
		Name     string `form:"names" db:"names"`
		LastName string `form:"last_names" db:"last_names"`
	}
	newPerson := &personAdviser{}
	if err := c.Bind(newPerson); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	adviser := &models.Adviser{}
	adviser.Name = newPerson.Name
	adviser.LastName = newPerson.LastName
	_, errCreate := tx.ValidateAndCreate(adviser) // se hace guardado de la data
	if errCreate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(adviser.ID))
}
func AdviserIndex(c buffalo.Context) error {
	pagination := &paginateList{}
	adviser := &models.Adviser{}
	advisers := &models.Advisers{}
	tx := c.Value("tx").(*pop.Connection)
	if err := c.Bind(pagination); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if err := c.Bind(adviser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	query := tx.Where("last_name||name ILIKE '%" + adviser.Name + "%' " + "OR " +
		"name||last_name ILIKE '%" + adviser.Name + "%'")
	if err := query.
		Paginate(pagination.Page, pagination.PerPage).
		All(advisers); err != nil {
		return c.Render(200, r.JSON(false))
	}
	count, _ := query.Count(adviser)
	dataSend := make((map[string]string))
	dataSend["advisers"] = advisers.String()
	pagination.Quantity = count
	paginat, _ := json.Marshal(pagination)
	dataSend["pagination"] = string(paginat)
	return c.Render(200, r.JSON(dataSend))
}
func AdviserCreate(c buffalo.Context) error {
	adviser := &models.Adviser{}
	if err := c.Bind(adviser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if _, errCreate := tx.ValidateAndCreate(adviser); errCreate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func AdviserUpdate(c buffalo.Context) error {
	adviser := &models.Adviser{}
	if err := c.Bind(adviser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if _, errUpdate := tx.ValidateAndUpdate(adviser); errUpdate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func AdviserShow(c buffalo.Context) error {
	return c.Render(200, r.JSON(true))
}
func AdviserDelete(c buffalo.Context) error {
	adviser := &models.Adviser{}
	if err := c.Bind(adviser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if err := tx.Find(adviser, adviser.ID); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if err := tx.Destroy(adviser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
