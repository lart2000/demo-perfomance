package models

import (
	"encoding/json"
	"time"

	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/uuid"
	"github.com/gobuffalo/validate"
)

type JuryThesi struct {
	ID        uuid.UUID `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	JuryID    uuid.UUID `json:"jury_id" db:"jury_id"`
	ThesisID  uuid.UUID `json:"thesis_id" db:"thesis_id"`
	ChargeID  uuid.UUID `json:"charge_id" db:"charge_id"`
}

// String is not required by pop and may be deleted
func (j JuryThesi) String() string {
	jj, _ := json.Marshal(j)
	return string(jj)
}

// JuryThesisDetails is not required by pop and may be deleted
type JuryThesisDetails []JuryThesi

// String is not required by pop and may be deleted
func (j JuryThesisDetails) String() string {
	jj, _ := json.Marshal(j)
	return string(jj)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (j *JuryThesi) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (j *JuryThesi) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (j *JuryThesi) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}
