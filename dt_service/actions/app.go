package actions

import (
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/buffalo/middleware"
	"github.com/gobuffalo/buffalo/middleware/ssl"
	"github.com/gobuffalo/envy"
	"github.com/unrolled/secure"

	"dt_service/models"
	//"fmt"
	"github.com/gobuffalo/x/sessions"
	"github.com/rs/cors"
)

// ENV is used to help switch settings based on where the
// application is being run. Default is "development".
var ENV = envy.Get("GO_ENV", "development")
var app *buffalo.App

// App is where all routes and middleware for buffalo
// should be defined. This is the nerve center of your
// application.
func App() *buffalo.App {
	if app == nil {
		c := cors.New(cors.Options{
			AllowedMethods:   []string{"GET", "POST", "DELETE"},
			AllowCredentials: true,
		})

		app = buffalo.New(buffalo.Options{
			Env:          ENV,
			SessionStore: sessions.Null{},
			PreWares: []buffalo.PreWare{
				c.Handler,
			},
			SessionName: "_degrees_titles",
		})
		// Automatically redirect to SSL
		app.Use(ssl.ForceSSL(secure.Options{
			SSLRedirect:     ENV == "production",
			SSLProxyHeaders: map[string]string{"X-Forwarded-Proto": "https"},
		}))

		if ENV == "development" {
			app.Use(middleware.ParameterLogger)
		}
		// Set the request content type to JSON
		app.Use(middleware.SetContentType("application/json"))
		app.Use(middleware.SetContentType("multipart/form-data"))

		app.Use(middleware.PopTransaction(models.DB))
		app.Use(MiddlewareLogin)
		app.Middleware.Skip(MiddlewareLogin, ThesisList, Login, GetSchools, GetThesisAllDataDetail, Logout)

		app.POST("/school", GetSchools)
		app.POST("/charge", GetCharges)

		app.POST("/login", Login)
		app.POST("/logout", Logout)
		app.POST("/tesis", ThesisList)
		app.POST("/tesis/all_data", GetThesisAllDataDetail)
		app.POST("/theses/get_data_edit", GetThesisDataToEdit)
		app.POST("/theses/create", CreateTheses)
		app.POST("/theses/update", UpdateTheses)
		app.POST("/user/change_name_user", ChangeNameUser)
		app.POST("/user/data_in_cookie", GetDataUserFromCookie)
		app.POST("/user/change_password", ChangePassword)
		app.POST("/user/validate_current_password", ValidateCurrentPassword)
		app.POST("/user/get_block", GetUserBlock)
		app.POST("/user/add_user", AddUser)
		app.POST("/user/get_users", GetAllUser)
		app.POST("/user/status", UserChangeStatus)
		app.POST("/user/update", UserUpdate)
		app.POST("/user/validate_name_user", ValidateNameUser)
		app.POST("/user/delete_user", DeleteUser)
		//app.GET("/a", prueba)
		app.POST("/author/filter", FilterAuthors)
		app.POST("/author/async_create", CreateAuthorAsync)
		app.POST("/adviser/filter", AdviserAdviserFilter)
		app.POST("/adviser/async_create", CreateAdviserAsync)
		app.POST("/jury/filter", JuryJuryFilter)
		app.POST("/jury/async_create", CreateJuryAsync)

		app.POST("/author/index", AuthorIndex)
		app.POST("/author/create", AuthorCreate)
		app.POST("/author/update", AuthorUpdate)
		app.POST("/author/delete", AuthorDelete)
		app.POST("/author/show", AuthorShow)

		app.POST("/jury/index", JuryIndex)
		app.POST("/jury/create", JuryCreate)
		app.POST("/jury/update", JuryUpdate)
		app.POST("/jury/delete", JuryDelete)
		app.POST("/jury/show", JuryShow)

		app.POST("/adviser/index", AdviserIndex)
		app.POST("/adviser/create", AdviserCreate)
		app.POST("/adviser/update", AdviserUpdate)
		app.POST("/adviser/delete", AdviserDelete)
		app.POST("/adviser/show", AdviserShow)
	}

	return app
}
