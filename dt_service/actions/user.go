package actions

import (
	"dt_service/models"
	"dt_service/utils"

	"fmt"
	"time"

	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
	"golang.org/x/crypto/bcrypt"
)

// ChangeNameUser change name of user
func ChangeNameUser(c buffalo.Context) error {
	type nameUser struct {
		Name     string `json:"name" db:"name" form:"name"`
		NameUser string `json:"user_name" db:"user_name" form:"user_name"`
	}
	NameUsers := &nameUser{}
	Users := &models.Users{}
	if err := c.Bind(NameUsers); err != nil {
		return c.Render(200, r.JSON(""))
	}
	tx := c.Value("tx").(*pop.Connection)
	fmt.Println(NameUsers.NameUser)
	query := tx.RawQuery("update users set full_name = '" + NameUsers.Name + "' where name_user = '" + NameUsers.NameUser + "'")
	if err1 := query.All(Users); err1 != nil {
		return c.Render(200, r.JSON(""))
	}
	return c.Render(200, r.JSON(NameUsers.Name))
}

//Response struct to send data for blocking user
type Response struct {
	Time    int64  `json:"time"`
	Message string `json:"message"`
}

//ValidateCurrentPassword validate current password and send his trieds
func ValidateCurrentPassword(c buffalo.Context) error {
	type Password struct {
		Letter   string `json:"password" form:"password"`
		UserName string `json:"user_name" form:"user_name"`
	}
	Responses := &Response{}
	Responses.Time = 0
	Responses.Message = "false"
	Passwords := &Password{}
	if err := c.Bind(Passwords); err != nil {
		return c.Render(200, r.JSON(Responses))
	}
	tx := c.Value("tx").(*pop.Connection)
	query := tx.RawQuery("select id,password from users where name_user = ?", Passwords.UserName)
	Users := &models.User{}
	if err := query.First(Users); err != nil {
		return c.Render(200, r.JSON(Responses))
	}
	if err := bcrypt.CompareHashAndPassword([]byte(Users.Password), []byte(Passwords.Letter)); err != nil {
		Logs := &models.LogPassword{}
		queryForGetLog := tx.RawQuery("select * from log_passwords where user_id = ?", Users.ID)
		if err := queryForGetLog.First(Logs); err != nil {
			Logs.UserID = Users.ID
			Logs.Tried = 1
			if err := tx.Save(Logs); err != nil {
				return c.Render(200, r.JSON(Responses))
			}
			return c.Render(200, r.JSON(Responses))
		}
		fmt.Println("antes", Logs.Tried)
		Logs.Tried = Logs.Tried + 1
		fmt.Println("despues", Logs.Tried)
		if err := tx.Update(Logs); err != nil {
			return c.Render(200, r.JSON(Responses))
		}
		if Logs.Tried > 3 && Logs.Tried < 6 {
			Responses.Message = "warning"
			return c.Render(200, r.JSON(Responses))
		}
		if Logs.Tried > 5 {
			fmt.Println(Logs.Tried)
			Responses.Message = "block"
			switch Logs.Tried {
			case 6:
				Responses.Time = 60000
				return c.Render(200, r.JSON(Responses))
			case 7:
				Responses.Time = 300000
				return c.Render(200, r.JSON(Responses))
			case 8:
				Responses.Time = 600000
				return c.Render(200, r.JSON(Responses))
			case 9:
				Responses.Time = 1800000
				return c.Render(200, r.JSON(Responses))
			case 10:
				Responses.Time = 3600000
				return c.Render(200, r.JSON(Responses))
			default:
				Responses.Time = 3600000
				return c.Render(200, r.JSON(Responses))
			}
		}
		return c.Render(200, r.JSON(Responses))
	}
	LogsPass := &models.LogPasswords{}
	queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", Users.ID)
	if err := queryDeleteLogs.All(LogsPass); err != nil {
		return c.Render(200, r.JSON(Responses))
	}
	Responses.Message = "true"
	return c.Render(200, r.JSON(Responses))
}

//ChangePassword change password
func ChangePassword(c buffalo.Context) error {
	type ChangePassword struct {
		Password string `form:"new_pass"`
		UserName string `form:"user_name"`
	}
	ChangePasswords := &ChangePassword{}
	if err := c.Bind(ChangePasswords); err != nil {
		return c.Render(200, r.JSON(false))
	}
	passCryp, _ := bcrypt.GenerateFromPassword([]byte(ChangePasswords.Password), 10)
	Users := &models.Users{}
	tx := c.Value("tx").(*pop.Connection)
	query := tx.RawQuery("update users set password = '" + string(passCryp) + "' where name_user = '" + ChangePasswords.UserName + "'")
	if err := query.All(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}

//UserData struct for send data of user
type UserData struct {
	FullName string `json:"full_name" db:"full_name"`
	RoleName string `json:"role_name" db:"role_name"`
	UserName string `json:"user_name" db:"user_name"`
	Status   string `json:"status" db:"status"`
}

//GetDataUserFromCookie get cookie and send to front
func GetDataUserFromCookie(c buffalo.Context) error {

	userCookie := &models.User{}
	utils.GetValueFromCookie(c.Value("user"), userCookie)

	tx := c.Value("tx").(*pop.Connection) // Establer conexión
	query := "SELECT full_name, roles.name as role_name, name_user as user_name FROM users " +
		"INNER JOIN roles ON roles.id = users.role_id " +
		"WHERE name_user = '" + userCookie.NameUser + "'"
	rawQuery := tx.RawQuery(query)

	currentUser := &UserData{}
	if err := rawQuery.First(currentUser); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(currentUser))
}

//GetUserID to get user.id
func GetUserID(c buffalo.Context) uuid.UUID {
	userCookie := &models.User{}
	utils.GetValueFromCookie(c.Value("user"), userCookie)
	tx := c.Value("tx").(*pop.Connection)
	type User struct {
		ID uuid.UUID `json:"id" db:"id" form:"id"`
	}
	Users := &User{}
	query := tx.RawQuery("select id from users where name_user = ?", userCookie.NameUser)
	query.First(Users)
	fmt.Println(Users)
	return Users.ID
}

//GetUserBlock for get the user is blocked or no
func GetUserBlock(c buffalo.Context) error {
	Responses := &Response{}
	Responses.Time = 0
	Responses.Message = "false"
	Logs := &models.LogPassword{}
	tx := c.Value("tx").(*pop.Connection)
	userID := GetUserID(c)
	queryForGetLog := tx.RawQuery("select * from log_passwords where user_id = ?", userID)
	if err := queryForGetLog.First(Logs); err != nil {
		return c.Render(200, r.JSON(Responses))
	}
	TimeToEvaluate := Logs.UpdatedAt
	t := time.Now()
	const format = "2006-01-02 15:04:05.000"
	FormatDateNow := t.Format(format)
	FormatDateEvaluate := TimeToEvaluate.Format(format)
	ParseTimeNow, _ := time.Parse(format, FormatDateNow)
	ParseTimeEvaluate, _ := time.Parse(format, FormatDateEvaluate)
	fmt.Println("==============================")
	secondsNow := ParseTimeNow.Unix() - ParseTimeEvaluate.Unix()
	if secondsNow >= 3600 {
		LogsPass := &models.LogPasswords{}
		queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
		if err := queryDeleteLogs.All(LogsPass); err != nil {
			return c.Render(200, r.JSON(Responses))
		}
	} else {
		miliSecondsNow := secondsNow * 1000
		if Logs.Tried > 3 && Logs.Tried < 6 {
			Responses.Message = "warning"
			return c.Render(200, r.JSON(Responses))
		}
		if Logs.Tried > 5 {
			Responses.Message = "block"
			switch Logs.Tried {
			case 6:
				if miliSecondsNow >= 60000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 60000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			case 7:
				if miliSecondsNow >= 300000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 300000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			case 8:
				if miliSecondsNow >= 600000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 600000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			case 9:
				if miliSecondsNow >= 1800000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 1800000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			case 10:
				if miliSecondsNow >= 3600000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 3600000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			default:
				if miliSecondsNow >= 3600000 {
					LogsPass := &models.LogPasswords{}
					queryDeleteLogs := tx.RawQuery("delete from log_passwords where user_id = ?", userID)
					if err := queryDeleteLogs.All(LogsPass); err != nil {
						return c.Render(200, r.JSON(Responses))
					}
					Responses.Time = 0
				} else {
					Responses.Time = 3600000 - miliSecondsNow
				}
				return c.Render(200, r.JSON(Responses))
			}
		}
	}
	Responses.Message = "true"
	return c.Render(200, r.JSON(Responses))
}

//AddUser function for add user
func AddUser(c buffalo.Context) error {
	type UserForm struct {
		FullName string `form:"full_name"`
		NameUser string `form:"name_user"`
		Password string `form:"password"`
		RoleName string `form:"role"`
	}
	UserForms := &UserForm{}
	if err := c.Bind(UserForms); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	QueryGetRoleID := tx.RawQuery("select id from roles where name = ?", UserForms.RoleName)
	Roles := &models.Role{}
	if err := QueryGetRoleID.First(Roles); err != nil {
		return c.Render(200, r.JSON(false))
	}
	Pass, _ := bcrypt.GenerateFromPassword([]byte(UserForms.Password), 10)
	Users := &models.User{}
	Users.FullName = UserForms.FullName
	Users.NameUser = UserForms.NameUser
	Users.Password = string(Pass)
	Users.Status = "1"
	Users.RoleID = Roles.ID
	if err := tx.Save(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}

//GetAllUser get all users
func GetAllUser(c buffalo.Context) error {
	tx := c.Value("tx").(*pop.Connection)
	query := "SELECT full_name, roles.name as role_name, name_user as user_name,status as status FROM users " +
		"INNER JOIN roles ON roles.id = users.role_id"
	rawQuery := tx.RawQuery(query)
	type User []UserData
	Users := &User{}
	if err := rawQuery.All(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	fmt.Println(Users)
	return c.Render(200, r.JSON(Users))
}

//UserChangeStatus func for change status of user
func UserChangeStatus(c buffalo.Context) error {
	type UserState struct {
		NameUser string `form:"name_user"`
		Status   string `form:"status"`
	}
	UserStatus := &UserState{}
	if err := c.Bind(UserStatus); err != nil {
		return c.Render(200, r.JSON(false))
	}
	Users := &models.Users{}
	tx := c.Value("tx").(*pop.Connection)
	query := tx.RawQuery("update users set status = '" + UserStatus.Status + "' where name_user = '" + UserStatus.NameUser + "'")
	if err := query.All(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}

//UserUpdate func for update user
func UserUpdate(c buffalo.Context) error {
	type UserForm struct {
		FullName    string `form:"full_name"`
		NameUser    string `form:"name_user"`
		CurrentName string `form:"current_name_user"`
		RoleName    string `form:"role_name"`
	}
	UserForms := &UserForm{}
	Users := &models.Users{}
	if err := c.Bind(UserForms); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	if UserForms.RoleName != "" {
		QueryGetRoleID := tx.RawQuery("select id from roles where name = ?", UserForms.RoleName)
		Roles := &models.Role{}
		if err := QueryGetRoleID.First(Roles); err != nil {
			return c.Render(200, r.JSON(false))
		}
		idRole := Roles.ID.String()
		fmt.Println(idRole)
		queryWithRole := tx.RawQuery("update users set full_name = '" + UserForms.FullName + "',name_user='" + UserForms.NameUser + "',role_id='" + idRole + "' where name_user='" + UserForms.CurrentName + "'")
		if err := queryWithRole.First(Users); err != nil {
			return c.Render(200, r.JSON(false))
		}
	} else {
		queryWithRole := tx.RawQuery("update users set full_name = '" + UserForms.FullName + "',name_user='" + UserForms.NameUser + "' where name_user = '" + UserForms.CurrentName + "'")
		if err := queryWithRole.All(Users); err != nil {
			return c.Render(200, r.JSON(false))
		}

	}
	query := "SELECT full_name, roles.name as role_name, name_user as user_name,status as status FROM users " +
		"INNER JOIN roles ON roles.id = users.role_id"
	rawQuery := tx.RawQuery(query)
	type UserArray []UserData
	Users2 := &UserArray{}
	if err := rawQuery.All(Users2); err != nil {
		return c.Render(200, r.JSON(false))
	}
	fmt.Println(Users2)
	return c.Render(200, r.JSON(Users2))
}

//ValidateNameUser for validate the name_user
func ValidateNameUser(c buffalo.Context) error {
	type User struct {
		UserName string `form:"name_user"`
		Count    int    `db:"count"`
	}
	Users := &User{}
	if err := c.Bind(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	tx := c.Value("tx").(*pop.Connection)
	query := tx.Select("count(*) as count")
	query.Where("name_user = ?", Users.UserName)
	if err := query.First(Users); err != nil {
		return c.Render(200, r.JSON(true))
	}
	if Users.Count > 0 {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}

func DeleteUser(c buffalo.Context) error {
	type UserArray struct {
		UserName string `form:"name_user"`
	}
	UserArrays := &UserArray{}
	if err := c.Bind(UserArrays); err != nil {
		return c.Render(200, r.JSON(false))
	}
	Users := &models.Users{}
	tx := c.Value("tx").(*pop.Connection)
	query := tx.RawQuery("delete from users where name_user = ?", UserArrays.UserName)
	if err := query.All(Users); err != nil {
		return c.Render(200, r.JSON(false))
	}
	return c.Render(200, r.JSON(true))
}
