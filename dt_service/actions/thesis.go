package actions

import (
	"dt_service/models"
	"dt_service/utils"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"

	"encoding/json"
	"strconv"
	"time"
)

type paginateList struct {
	Quantity int `form:"quantity" db:"quantity"` // data en la tabla
	PerPage  int `form:"per_page"`               // data por página
	Page     int `form:"page"`                   // la posición de la página
}

type dataFilterTheses struct { // estructura que contendrá la data  para filtrado
	TitleFilter string `json:"title_filter" form:"title_filter"`
	Authors     string `json:"authors" form:"authors"`
	Advisers    string `json:"advisers" form:"advisers"`
	Juries      string `json:"juries" form:"juries"`
	Schools     string `json:"schools" form:"schools"`
}

type rowThesis struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Code      string    `json:"code" db:"code"`
	Name      string    `json:"name" db:"name"`
	DateLift  time.Time `json:"date_lift" db:"date_lift"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type listTheses []rowThesis

func ThesisList(c buffalo.Context) error {
	dataFilter := &dataFilterTheses{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFilter); err != nil {
		return c.Render(200, r.JSON(false))
	}

	pagList := &paginateList{} // estructura para la data de la paginación
	if err := c.Bind(pagList); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión

	statusWhere := false

	txtWhereAuthors := ""
	if dataFilter.Authors != "" {
		txtWhereAuthors = utils.GetWhereInArrayTxt("authors.name", "authors.last_name", dataFilter.Authors)
		statusWhere = true
	}

	txtWhereAdvisers := ""
	innerJoinAdvisers := ""
	if dataFilter.Advisers != "" {
		innerJoinAdvisers = "INNER JOIN adviser_thesis ON adviser_thesis.thesis_id = theses.id " +
			"INNER JOIN advisers ON adviser_thesis.adviser_id = advisers.id "
		if statusWhere {
			txtWhereAdvisers = " OR "
		}
		txtWhereAdvisers += utils.GetWhereInArrayTxt("advisers.name", "advisers.last_name", dataFilter.Advisers)
		statusWhere = true
	}

	txtWhereJuries := ""
	innerJoinJuries := ""
	if dataFilter.Juries != "" {
		innerJoinJuries = "INNER JOIN jury_thesis ON jury_thesis.thesis_id = theses.id " +
			"INNER JOIN juries ON jury_thesis.jury_id = juries.id "
		if statusWhere {
			txtWhereJuries = " OR "
		}
		txtWhereJuries += utils.GetWhereInArrayTxt("juries.name", "juries.last_name", dataFilter.Juries)
		statusWhere = true
	}

	// query para las escuelas
	txtWhereInSchool := utils.GetWhereInArrayId("authors.school_id", dataFilter.Schools)
	fullWhereQuery := " WHERE " + txtWhereInSchool

	txtWhereThesis := utils.GetQueryWhereFilter("theses.name", dataFilter.TitleFilter)
	if txtWhereThesis != "" {
		fullWhereQuery += " AND " + txtWhereThesis
	}
	if statusWhere {
		fullWhereQuery += " AND (" + txtWhereAuthors + " " + txtWhereAdvisers + " " + txtWhereJuries + ")"
	}

	fullInnerJoin := innerJoinAdvisers + innerJoinJuries

	if pagList.Quantity == 0 {
		query := tx.RawQuery("with tbl_th as ( SELECT DISTINCT theses.id FROM theses " +
			"INNER JOIN author_thesis ON author_thesis.thesis_id = theses.id " +
			"INNER JOIN authors ON authors.id = author_thesis.author_id " +
			"INNER JOIN schools ON schools.id = authors.school_id " +
			fullInnerJoin +
			fullWhereQuery + " ) select COUNT(*) AS quantity from tbl_th") // se hace query con la data del filtrado para la paginación
		if err := query.First(pagList); err != nil {
			return c.Render(200, r.JSON(false))
		}
	}

	dataSend := make(map[string]string)
	if pagList.Quantity != 0 {
		theses := &listTheses{}
		query := tx.RawQuery("SELECT DISTINCT theses.id, theses.name,theses.code, theses.date_lift, theses.updated_at FROM theses " +
			"INNER JOIN author_thesis ON author_thesis.thesis_id = theses.id " +
			"INNER JOIN authors ON authors.id = author_thesis.author_id " +
			"INNER JOIN schools ON schools.id = authors.school_id " +
			fullInnerJoin +
			fullWhereQuery +
			" ORDER BY theses.updated_at DESC, theses.date_lift DESC LIMIT " + strconv.Itoa(pagList.PerPage) +
			" OFFSET " + strconv.Itoa(pagList.PerPage*(pagList.Page-1)))
		if err := query.All(theses); err != nil {
			return c.Render(200, r.JSON(false))
		}
		out, _ := json.Marshal(theses)
		dataSend["thesis"] = string(out) // .String() es una función de convertir los slices a string
	} else {
		dataSend["thesis"] = "[]"
	}

	pag, _ := json.Marshal(pagList)      // se convierte en json la data de la paginación
	dataSend["pagination"] = string(pag) // dicho json se convierte en string para que pueda encajar con el arreglo
	return c.Render(200, r.JSON(dataSend))
}

type idThesis struct { // estructura que contendrá la data  para filtrado
	Id string `form:"id"`
}

// GetThesisAllDataDetail para obtener datos para el listado
func GetThesisAllDataDetail(c buffalo.Context) error {
	dataFind := &idThesis{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFind); err != nil {
		return c.Render(200, r.JSON(false))
	}
	type authorsQuery struct { // estructura que contendrá la data  para filtrado
		Name     string `json:"name" db:"name"`
		LastName string `json:"last_name" db:"last_name"`
		School   string `json:"school" db:"school"`
	}

	type authorGroup []authorsQuery

	idThesis := dataFind.Id
	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	authors := &authorGroup{}
	query := tx.RawQuery("SELECT DISTINCT authors.name,authors.last_name,schools.name as school FROM authors " +
		"INNER JOIN author_thesis ON author_thesis.author_id = authors.id " +
		"INNER JOIN schools ON schools.id = authors.school_id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(authors); err != nil {
		return c.Render(200, r.JSON(false))
	}

	advisers := &models.Advisers{}
	query = tx.RawQuery("SELECT DISTINCT advisers.name,advisers.last_name FROM advisers " +
		"INNER JOIN adviser_thesis ON adviser_thesis.adviser_id = advisers.id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(advisers); err != nil {
		return c.Render(200, r.JSON(false))
	}

	type juriesQuery struct { // estructura que contendrá la data  para filtrado
		Name     string `json:"name" db:"name"`
		LastName string `json:"last_name" db:"last_name"`
		Charge   string `json:"charge" db:"charge"`
	}

	type juryGroup []juriesQuery
	juries := &juryGroup{}
	query = tx.RawQuery("SELECT DISTINCT juries.name,juries.last_name, charges.name as charge FROM juries " +
		"INNER JOIN jury_thesis ON jury_thesis.jury_id = juries.id " +
		"INNER JOIN charges ON charges.id = jury_thesis.charge_id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(juries); err != nil {
		return c.Render(200, r.JSON(false))
	}

	outAuthors, _ := json.Marshal(authors)
	dataSend := make(map[string]string)
	dataSend["authors"] = string(outAuthors)
	dataSend["advisers"] = advisers.String()
	outJuries, _ := json.Marshal(juries)
	dataSend["juries"] = string(outJuries)
	return c.Render(200, r.JSON(dataSend))
}

// GetThesisDataToEdit para todo los datos relacionado a la tesis
func GetThesisDataToEdit(c buffalo.Context) error {
	dataFind := &idThesis{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(dataFind); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión

	these := &models.These{}
	these.ID, _ = uuid.FromString(dataFind.Id)
	if err := tx.Find(these, these.ID); err != nil {
		return c.Render(200, r.JSON(false))
	}
	type personQuery struct { // estructura que contendrá la data  para filtrado
		ID       string `json:"id" db:"id"`
		Name     string `json:"name" db:"name"`
		LastName string `json:"last_name" db:"last_name"`
		Detail   string `json:"detail" db:"detail"`
		DetailID string `json:"detail_id" db:"detail_id"`
	}

	type personGroup []personQuery

	idThesis := dataFind.Id
	authors := &personGroup{}
	query := tx.RawQuery("SELECT DISTINCT authors.id,authors.name,authors.last_name,schools.id as detail_id,schools.name as detail FROM authors " +
		"INNER JOIN author_thesis ON author_thesis.author_id = authors.id " +
		"INNER JOIN schools ON schools.id = authors.school_id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(authors); err != nil {
		return c.Render(200, r.JSON(false))
	}

	juries := &personGroup{}
	query = tx.RawQuery("SELECT DISTINCT juries.id, juries.name,juries.last_name, charges.id as detail_id, charges.name as detail FROM juries " +
		"INNER JOIN jury_thesis ON jury_thesis.jury_id = juries.id " +
		"INNER JOIN charges ON charges.id = jury_thesis.charge_id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(juries); err != nil {
		return c.Render(200, r.JSON(false))
	}

	advisers := &personGroup{}
	query = tx.RawQuery("SELECT DISTINCT advisers.id, advisers.name,advisers.last_name,'' as detail_id,'' as detail FROM advisers " +
		"INNER JOIN adviser_thesis ON adviser_thesis.adviser_id = advisers.id " +
		"WHERE thesis_id = '" + idThesis + "'")
	if err := query.All(advisers); err != nil {
		return c.Render(200, r.JSON(false))
	}

	outString, _ := json.Marshal(authors)
	dataSend := make(map[string]string)
	dataSend["thesis"] = these.String()
	dataSend["authors"] = string(outString)
	outString, _ = json.Marshal(advisers)
	dataSend["advisers"] = string(outString)
	outString, _ = json.Marshal(juries)
	dataSend["juries"] = string(outString)
	return c.Render(200, r.JSON(dataSend))
}

// CreateTheses es para crear tesis
type dataForm struct {
	ID       string    `form:"id"`
	Title    string    `form:"title"`
	Code     string    `form:"code"`
	DateLift time.Time `form:"date_lift"`
	Author   string    `form:"author"`
	Jury     string    `form:"jury"`
	Adviser  string    `form:"adviser"`
}

type jsonData struct {
	DetailID string `json:"detail_id"`
	ID       string `json:"id"`
}

func CreateTheses(c buffalo.Context) error {

	data := &dataForm{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(data); err != nil {
		return c.Render(200, r.JSON(false))
	}

	tx := c.Value("tx").(*pop.Connection) // Establer conexión

	these := &models.These{}
	these.Code = data.Code
	these.Name = data.Title
	these.Summary = data.Title
	these.DateLift = data.DateLift
	these.Status = "1"

	_, errCreate := tx.ValidateAndCreate(these) // se hace guardado de la data
	if errCreate != nil {
		return c.Render(200, r.JSON(false))
	}

	st := creationDataForTheses(c, data, these.ID)
	if !st {
		return c.Render(200, r.JSON(false))
	}

	return c.Render(200, r.JSON(true))
}

func creationDataForTheses(c buffalo.Context, data *dataForm, id uuid.UUID) bool {
	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	type arrayJSONData []jsonData

	authorsTheses := arrayJSONData{}
	err := json.Unmarshal([]byte(data.Author), &authorsTheses)
	if err != nil {
		return false
	}

	for _, item := range authorsTheses {
		idAuthor, _ := uuid.FromString(item.ID)
		atDetail := &models.AuthorThesi{}
		atDetail.AuthorID = idAuthor
		atDetail.ThesisID = id

		_, errCreate := tx.ValidateAndCreate(atDetail) // se hace guardado de la data
		if errCreate != nil {
			return false
		}
	}

	adviserTheses := arrayJSONData{}
	err = json.Unmarshal([]byte(data.Adviser), &adviserTheses)
	if err != nil {
		return false
	}

	for _, item := range adviserTheses {
		idAdviser, _ := uuid.FromString(item.ID)
		atDetail := &models.AdviserThesi{}
		atDetail.AdviserID = idAdviser
		atDetail.ThesisID = id

		_, errCreate := tx.ValidateAndCreate(atDetail) // se hace guardado de la data
		if errCreate != nil {
			return false
		}
	}

	juryTheses := arrayJSONData{}
	err = json.Unmarshal([]byte(data.Jury), &juryTheses)
	if err != nil {
		return false
	}

	for _, item := range juryTheses {
		idJury, _ := uuid.FromString(item.ID)
		idCharge, _ := uuid.FromString(item.DetailID)
		atDetail := &models.JuryThesi{}
		atDetail.JuryID = idJury
		atDetail.ChargeID = idCharge
		atDetail.ThesisID = id

		_, errCreate := tx.ValidateAndCreate(atDetail) // se hace guardado de la data
		if errCreate != nil {
			return false
		}
	}
	return true
}

// UpdateTheses es para actualización de las tesis
func UpdateTheses(c buffalo.Context) error {
	data := &dataForm{} // inicio variable para almacenar el valor del filtrado
	if err := c.Bind(data); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	these := &models.These{}
	these.ID, _ = uuid.FromString(data.ID)

	if err := tx.Find(these, these.ID); err != nil {
		return c.Render(200, r.JSON(false))
	}

	these.Code = data.Code
	these.Name = data.Title
	these.Summary = data.Title
	these.DateLift = data.DateLift
	these.Status = "1"

	_, errCreate := tx.ValidateAndUpdate(these) // se hace guardado de la data
	if errCreate != nil {
		return c.Render(200, r.JSON(false))
	}

	tbls := [3]string{"author_thesis", "jury_thesis", "adviser_thesis"}
	for _, word := range tbls {
		err := tx.RawQuery("delete from "+word+" WHERE thesis_id=?", data.ID).Exec()
		if err != nil {
			return c.Render(200, r.JSON(false))
		}
	}

	st := creationDataForTheses(c, data, these.ID)
	if !st {
		return c.Render(200, r.JSON(false))
	}

	return c.Render(200, r.JSON(these))
}
