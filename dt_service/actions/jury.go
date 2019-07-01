package actions

import (
	"dt_service/models"
	"dt_service/utils"

	"encoding/json"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
)

type dataFilterJury struct { // estructura que contendrá la data  para filtrado
	JuryName string `json:"jury_name" form:"jury_name"`
}

type rowJury struct {
	ID       uuid.UUID `json:"id" db:"id"`
	Name     string    `json:"name" db:"name"`
	LastName string    `json:"last_name" db:"last_name"`
}

type listJuries []rowJury

func JuryJuryFilter(c buffalo.Context) error {
	dataFilter := &dataFilterJury{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFilter); err != nil {
		return c.Render(200, r.JSON(false))
	}

	txtQuery := utils.GetWhereInArrayTxt("juries.name", "juries.last_name", dataFilter.JuryName)

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	authors := &listJuries{}
	query := tx.RawQuery("SELECT id, juries.name, juries.last_name FROM juries " +
		"WHERE " + txtQuery + " LIMIT 8")
	if err := query.All(authors); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(authors))
}

func CreateJuryAsync(c buffalo.Context) error {
	type personJury struct {
		Name     string `form:"names" db:"names"`
		LastName string `form:"last_names" db:"last_names"`
	}
	newPerson := &personJury{}
	if err := c.Bind(newPerson); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	jury := &models.Jury{}
	jury.Name = newPerson.Name
	jury.LastName = newPerson.LastName
	_, errCreate := tx.ValidateAndCreate(jury) // se hace guardado de la data
	if errCreate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(jury.ID))
}

func JuryIndex(c buffalo.Context) error {
	pagination := &paginateList{}
	jury := &models.Jury{}
	juries := &models.Juries{}
	tx := c.Value("tx").(*pop.Connection)
	if err := c.Bind(pagination); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if err := c.Bind(jury); err != nil {
		return c.Render(200, r.JSON(false))
	}
	query := tx.Where("last_name||name ILIKE '%" + jury.Name + "%' " + "OR " +
		"name||last_name ILIKE '%" + jury.Name + "%'")
	if err := query.
		Paginate(pagination.Page, pagination.PerPage).
		All(juries); err != nil {
		return c.Render(200, r.JSON(false))
	}
	count, _ := query.Count(jury)
	dataSend := make((map[string]string))
	dataSend["juries"] = juries.String()
	pagination.Quantity = count
	paginat, _ := json.Marshal(pagination)
	dataSend["pagination"] = string(paginat)
	return c.Render(200, r.JSON(dataSend))
}
func JuryCreate(c buffalo.Context) error {
	jury := &models.Jury{}
	if err := c.Bind(jury); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if _, errCreate := tx.ValidateAndCreate(jury); errCreate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func JuryUpdate(c buffalo.Context) error {
	jury := &models.Jury{}
	if err := c.Bind(jury); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if _, errUpdate := tx.ValidateAndUpdate(jury); errUpdate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func JuryShow(c buffalo.Context) error {
	return c.Render(200, r.JSON(true))
}
func JuryDelete(c buffalo.Context) error {
	jury := &models.Jury{}
	if err := c.Bind(jury); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if err := tx.Find(jury, jury.ID); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if err := tx.Destroy(jury); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
