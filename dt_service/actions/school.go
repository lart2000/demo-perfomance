package actions

import (
	"dt_service/models"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
)

func GetSchools(c buffalo.Context) error {
	schools := &models.Schools{}
	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	query := tx.RawQuery("SELECT id, name FROM schools")
	if err := query.All(schools); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(schools))
}
