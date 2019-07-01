package actions

import (
	"dt_service/models"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
)

// MiddlewareLogin para validar acceso
func MiddlewareLogin(next buffalo.Handler) buffalo.Handler {
	return func(c buffalo.Context) error {
		val, err := c.Cookies().Get("_sdat")
		if err != nil {
			return c.Render(200, r.JSON(nil)) // si no hay cookie return nil
		}

		tx := c.Value("tx").(*pop.Connection) // conection
		userModel := &models.User{}
		currentHash := tx.Where("hash='" + val + "'")
		query := currentHash.Join("code_hashes", "code_hashes.user_id=users.id")
		err = query.First(userModel)
		if err != nil {
			return c.Render(200, r.JSON(nil))
		}
		c.Set("user", userModel)
		errc := next(c)
		// do some work after calling the next handler
		return errc
	}
}
