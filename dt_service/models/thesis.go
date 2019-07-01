package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
	"github.com/gobuffalo/validate"
	"github.com/gobuffalo/validate/validators"
)

type These struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Code      string    `json:"code" db:"code"`
	Name      string    `json:"name" db:"name"`
	Summary   string    `json:"summary" db:"summary"`
	DateLift  time.Time `json:"date_lift" db:"date_lift"`
	Status    string    `json:"status" db:"status"`
}

// String is not required by pop and may be deleted
func (t These) String() string {
	jt, _ := json.Marshal(t)
	return string(jt)
}

// Thesis is not required by pop and may be deleted
type Thesis []These

// String is not required by pop and may be deleted
func (t Thesis) String() string {
	jt, _ := json.Marshal(t)
	return string(jt)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (t *These) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.Validate(
		&validators.StringIsPresent{Field: t.Name, Name: "Name"},
		&validators.StringIsPresent{Field: t.Code, Name: "Code"},
		&validators.StringIsPresent{Field: t.Summary, Name: "Summary"},
		&validators.TimeIsPresent{Field: t.DateLift, Name: "DateLift"},
	), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (t *These) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (t *These) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
