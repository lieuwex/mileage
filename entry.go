package main

import "time"

type EntryType int

const (
	mileage EntryType = iota
	payement
)

type Entry struct {
	// typ EntryType
	Type    string    `json:"type"`
	Price   float64   `json:"price"`
	Mileage int64     `json:"mileage"`
	Date    time.Time `json:"date"`
}
