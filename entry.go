package main

import "time"

type Addition struct {
	Type string `json:"type"`

	Price   float64 `json:"price"`
	Mileage int64   `json:"mileage"`

	Date time.Time `json:"date"`
}

type Entry struct {
	Type  string  `json:"type"`
	Price float64 `json:"price"`

	BeginMileage int64 `json:"beginMileage"`
	EndMileage   int64 `json:"endMileage"`

	BeginDate time.Time `json:"beginDate"`
	EndDate   time.Time `json:"endDate"`
}
