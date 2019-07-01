package utils

import (
	"encoding/json"
	"strings"
)

func GetQueryWhereFilter(field, txt string) (queryTxt string) {
	queryTxt = ""
	rpta := strings.Split(txt, " ")
	lenArr := len(rpta)
	if txt == "" {
		return
	} else {
		txt = strings.Replace(txt, " ", "%", -1)
		whereTxt := "LOWER ( TRANSLATE (" + field + ", 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ'))"
		queryTxt += whereTxt + " like '%" + txt + "%'"
		if lenArr > 1 {
			lenArr--
			queryTxt += " OR "
			word := "%"
			for i := lenArr; i >= 0; i-- {
				word += rpta[i] + "%"
			}
			queryTxt += whereTxt + " like '%" + word + "%'"
		}
	}
	return
}

func GetWhereInArrayId(field, txt string) (queryTxt string) {
	txt = strings.Replace(txt, ",", "','", -1)
	if txt == "" {
		queryTxt = field + " IN ('00000000-0000-0000-0000-000000000000')"
		return
	}
	queryTxt = field + " IN ('" + txt + "')"
	return
}

func GetWhereInArrayTxt(f_field, s_field, txt string) (queryTxt string) {
	queryTxt = "("
	rpta := strings.Split(txt, ",")
	for _, word := range rpta {
		queryTxt += GetQueryWhereFilterName(f_field+" || ' ' || "+s_field, word)
		queryTxt += " OR "
	}
	length := len(rpta)
	count := 1
	for _, word := range rpta {
		queryTxt += GetQueryWhereFilterName(s_field+" || ' ' || "+f_field, word)
		if count != length {
			queryTxt += " OR "
		}
		count++
	}
	queryTxt += ")"
	return
}

func GetQueryWhereFilterName(field, txt string) (queryTxt string) {
	queryTxt = ""
	rpta := strings.Split(txt, " ")
	lenArr := len(rpta)
	if lenArr == 0 {
		return ""
	} else {
		txt = strings.Replace(txt, " ", "%", -1)
		whereTxt := "LOWER ( TRANSLATE (" + field + ", 'áéíóúÁÉÍÓÚäëïöüÄËÏÖÜñ', 'aeiouAEIOUaeiouAEIOUÑ'))"
		queryTxt += whereTxt + " like '%" + txt + "%'"
	}
	return
}

// GetValueFromCookie caster valor asignado desde cookie
func GetValueFromCookie(val, classI interface{}) (classR interface{}) {
	outString, _ := json.Marshal(val)
	json.Unmarshal([]byte(outString), classI)
	return classI
}
