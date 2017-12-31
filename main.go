package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/rs/cors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var entriesColl, currentTripColl *mgo.Collection

func frontHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("TODO"))
}

func addHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		return
	}

	bytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		serverError(w, err)
		return
	}

	var entry Addition
	err = json.Unmarshal(bytes, &entry)
	if err != nil {
		serverError(w, err)
		return
	}
	entry.Date = bson.Now()

	log.Printf("received new entry: %#v", entry)

	dbEntry := Entry{
		EndDate: entry.Date,
	}

	switch entry.Type {
	case "trip-start":
		if err = currentTripColl.Insert(&entry); err != nil {
			log.Println(err.Error())
		}
		return
	case "trip-end":
		trips := make([]Addition, 0)
		if err = currentTripColl.Find(nil).All(&trips); err != nil {
			log.Println(err.Error())
			return
		}

		if len(trips) != 1 {
			log.Printf("expected length of trips to be 1, got %d", len(trips))
			return
		}

		currentTripColl.RemoveAll(nil)

		dbEntry.Type = "mileage"
		dbEntry.BeginMileage = trips[0].Mileage
		dbEntry.EndMileage = entry.Mileage
		dbEntry.BeginDate = trips[0].Date

	case "payment":
		dbEntry.Price = entry.Price
		dbEntry.Type = "payment"

	default:
		serverError(w, fmt.Errorf("unknown type '%s'", entry.Type))
		return
	}

	if err = entriesColl.Insert(&dbEntry); err != nil {
		log.Println(err.Error())
		return
	}
}

func entriesHandler(w http.ResponseWriter, r *http.Request) {
	entries := make([]Entry, 0)
	if err := entriesColl.Find(nil).Sort("date").All(&entries); err != nil {
		serverError(w, err)
		return
	}

	bytes, err := json.Marshal(entries)
	if err != nil {
		serverError(w, err)
		return
	}
	fmt.Fprintf(w, "%s\n", bytes)
}

func currentTripHandler(w http.ResponseWriter, r *http.Request) {
	trips := make([]Addition, 0)
	if err := currentTripColl.Find(nil).All(&trips); err != nil {
		serverError(w, err)
		return
	}

	var bytes []byte
	if len(trips) > 0 {
		var err error
		bytes, err = json.Marshal(trips[0])
		if err != nil {
			serverError(w, err)
			return
		}
	} else {
		bytes = []byte("null")
	}
	fmt.Fprintf(w, "%s\n", bytes)
}

func usage(execName string) {
	fmt.Printf("usage:\t%s <db name>\n", execName)
	os.Exit(1)
}

func main() {
	args := os.Args[1:]
	if len(args) != 1 {
		fmt.Printf("1 argument expected, %d given.\n\n", len(args))
		usage(os.Args[0])
	}
	dbName := args[0]

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("no port given")
	}
	mongoUrl := os.Getenv("MONGO_URL")
	if mongoUrl == "" {
		log.Fatal("no mongo url given")
	}

	session, err := mgo.Dial(mongoUrl)
	if err != nil {
		panic(err)
	}
	defer session.Close()

	session.SetMode(mgo.Strong, true)
	entriesColl = session.DB(dbName).C("entries")
	currentTripColl = session.DB(dbName).C("currentTrip")

	mux := http.NewServeMux()
	mux.Handle("/", http.StripPrefix("/web/", http.FileServer(http.Dir("web"))))
	mux.HandleFunc("/add", addHandler)
	mux.HandleFunc("/entries", entriesHandler)
	mux.HandleFunc("/currentTrip", currentTripHandler)

	log.Printf("listening on %s", port)

	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
