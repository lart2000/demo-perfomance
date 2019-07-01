package actions

import (
	"dt_service/models"
	"dt_service/utils"

	"github.com/gobuffalo/buffalo"

	"encoding/json"
	"fmt"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
)

type dataFilterAuthors struct { // estructura que contendrá la data  para filtrado
	AuthorName string `json:"author_name" form:"author_name"`
}

type rowAuthor struct {
	ID       uuid.UUID `json:"id" db:"id"`
	Name     string    `json:"name" db:"name"`
	LastName string    `json:"last_name" db:"last_name"`
	IdDetail string    `json:"detail_id" db:"detail_id"`
}

type listAuthors []rowAuthor

func FilterAuthors(c buffalo.Context) error {
	dataFilter := &dataFilterAuthors{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFilter); err != nil {
		return c.Render(200, r.JSON(false))
	}

	txtQuery := utils.GetWhereInArrayTxt("authors.name", "authors.last_name", dataFilter.AuthorName)

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	authors := &listAuthors{}
	query := tx.RawQuery("SELECT authors.id, authors.name, authors.last_name,schools.id as detail_id FROM authors " +
		"INNER JOIN schools ON schools.id = authors.school_id " +
		"WHERE " + txtQuery + " LIMIT 8")
	if err := query.All(authors); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(authors))
}

type personAuthor struct {
	Name     string    `form:"names" db:"names"`
	LastName string    `form:"last_names" db:"last_names"`
	SchoolID uuid.UUID `form:"detail_id" db:"school_id"`
}

func CreateAuthorAsync(c buffalo.Context) error {
	newPerson := &personAuthor{}
	if err := c.Bind(newPerson); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	author := &models.Author{}
	author.Name = newPerson.Name
	author.LastName = newPerson.LastName
	author.SchoolID = newPerson.SchoolID
	_, errCreate := tx.ValidateAndCreate(author) // se hace guardado de la data
	if errCreate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(author.ID))
}
func AuthorCreate(c buffalo.Context) error {
	author := &models.Author{}
	if err := c.Bind(author); err != nil {
		fmt.Println("========================")
		fmt.Println(err)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection)
	if _, errCreate := tx.ValidateAndCreate(author); errCreate != nil {
		fmt.Println("========================")
		fmt.Println(errCreate)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func AuthorUpdate(c buffalo.Context) error {
	author := &models.Author{}
	tx := c.Value("tx").(*pop.Connection)
	if err := c.Bind(author); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if _, errUpdate := tx.ValidateAndUpdate(author); errUpdate != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func AuthorDelete(c buffalo.Context) error {
	author := &models.Author{}
	if err := c.Bind(author); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if err := tx.Find(author, author.ID); err != nil {
		return c.Render(200, r.JSON(false))
	}
	if err := tx.Destroy(author); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
func AuthorIndex(c buffalo.Context) error {

	fmt.Println("========================")
	fmt.Println("entro")
	fmt.Println("========================")
	pagination := &paginateList{}
	type School_ids struct {
		School_ids string `form:"school_ids"`
	}
	schools := &School_ids{}
	author_name := &models.Author{} //por s¿que solo lo utilizare para bindear el nombre del filtrado
	if err := c.Bind(pagination); err != nil {
		fmt.Println("========================")
		fmt.Println(err)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}
	if err := c.Bind(schools); err != nil {
		fmt.Println("========================")
		fmt.Println(err)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}
	if err := c.Bind(author_name); err != nil {
		fmt.Println("========================")
		fmt.Println(err)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}
	fmt.Println("========================")
	fmt.Println("=aqui=")
	fmt.Println(schools.School_ids)
	fmt.Println("========================")
	authors := &models.Authors{}
	tx := c.Value("tx").(*pop.Connection)
	if err := tx.Where("( last_name||name ILIKE '%"+author_name.Name+"%'"+
		" OR name||last_name ILIKE '%"+author_name.Name+"%'"+
		" ) AND school_id in (SELECT id FROM schools WHERE name  in ('"+schools.School_ids+"'))").
		Paginate(pagination.Page, pagination.PerPage).
		Order("last_name , name ").
		All(authors); err != nil {
		fmt.Println("========================")
		fmt.Println(err)
		fmt.Println("========================")
		return c.Render(200, r.JSON(false))
	}
	type count struct {
		Count int `db:"count"`
	}
	counter := &count{}
	_ = tx.RawQuery("SELECT count(name) AS count FROM authors WHERE ( last_name||name ILIKE '%" + author_name.Name + "%'" +
		" OR name||last_name ILIKE '%" + author_name.Name + "%'" +
		" ) AND school_id in (SELECT id FROM schools WHERE name  in ('" + schools.School_ids + "'))").First(counter)
	dataSend := make(map[string]string)
	dataSend["authors"] = authors.String()
	pagination.Quantity = counter.Count
	paginat, _ := json.Marshal(pagination)
	dataSend["pagination"] = string(paginat)

	return c.Render(200, r.JSON(dataSend))
}
func AuthorShow(c buffalo.Context) error {
	author := &models.Author{}
	if err := c.Bind(author); err != nil { //solo necesita el id
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if err := tx.First(author); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(author))
}
