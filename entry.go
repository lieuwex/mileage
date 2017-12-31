package main

import "time"

type Entry struct {
	Type  string  `json:"type"`
	Price float64 `json:"price"`

	BeginMileage int64 `json:"beginMileage"`
	EndMileage   int64 `json:"endMileage"`

	BeginDate time.Time `json:"beginDate"`
	EndDate   time.Time `json:"endDate"`
}
