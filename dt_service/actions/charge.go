package actions

import (
	"dt_service/models"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
)

func GetCharges(c buffalo.Context) error {
	charges := &models.Charges{}
	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	query := tx.RawQuery("SELECT id, name FROM charges")
	if err := query.All(charges); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(charges))
}
