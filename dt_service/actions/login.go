package actions

import (
	"dt_service/models"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"golang.org/x/crypto/bcrypt"
)

// Login - Iniciar Sesion
func Login(c buffalo.Context) error {
	user := &models.User{}
	//trae la data de la vista
	if err := c.Bind(user); err != nil {
		return err
	}

	tx := c.Value("tx").(*pop.Connection) // conection
	codeHash := []models.CodeHash{}
	query := tx.Where("(now() - created_at ) > interval '1 day'")
	if err := query.All(&codeHash); err != nil {
		return c.Render(200, r.JSON(false))
	}

	for _, row := range codeHash {
		tx.Destroy(&row)
	}

	userDB := &models.User{}
	query = tx.Where("name_user = ?", user.NameUser).Where("status = ?", "1")
	if err := query.First(userDB); err != nil {
		return c.Render(200, r.JSON(false))
	}

	isCorrect := bcrypt.CompareHashAndPassword([]byte(userDB.Password), []byte(user.Password))
	if isCorrect != nil { // si hay error return nill
		return c.Render(200, r.JSON(nil))
	}
	valToEncrypt := userDB.NameUser + time.Now().String()
	passbyte, _ := bcrypt.GenerateFromPassword([]byte(valToEncrypt), -1)

	hashModel := &models.CodeHash{}
	hashModel.Hash = string(passbyte)
	hashModel.UserID = userDB.ID
	if _, errCreate := tx.ValidateAndCreate(hashModel); errCreate != nil {
		return c.Render(200, r.JSON(false))
	}

	c.Cookies().Set("_sdat", hashModel.Hash, 5*time.Hour)

	return c.Render(200, r.JSON(true))
}

// Logout Cerrar sesion
func Logout(c buffalo.Context) error {
	val, err := c.Cookies().Get("_sdat")
	if err != nil {
		return c.Render(200, r.JSON(true))
	}

	tx := c.Value("tx").(*pop.Connection) // conection

	hashModel := &models.CodeHash{}
	query := tx.Where("hash='" + val + "'")
	err = query.First(hashModel)
	if err != nil {
		c.Cookies().Delete("_sdat")
		return c.Render(200, r.JSON(true))
	}
	tx.Destroy(hashModel)

	c.Cookies().Delete("_sdat")
	return c.Render(200, r.JSON(true))

}
