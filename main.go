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

var coll *mgo.Collection

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

	var entry Entry
	err = json.Unmarshal(bytes, &entry)
	if err != nil {
		serverError(w, err)
		return
	}

	log.Printf("received new entry: %#v", entry)

	// REVIEW: startDate
	entry.EndDate = bson.Now()

	err = coll.Insert(&entry)
	if err != nil {
		log.Println(err.Error())
		return
	}
}

func entriesHandler(w http.ResponseWriter, r *http.Request) {
	entries := make([]Entry, 0)
	err := coll.Find(nil).Sort("date").All(&entries)
	if err != nil {
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

func main() {
	args := os.Args[1:]
	if len(args) < 2 {
		log.Fatalf("2 arguments required, %d given.\n", len(args))
	}
	dbName, collName := args[0], args[1]

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
	coll = session.DB(dbName).C(collName)

	mux := http.NewServeMux()
	mux.Handle("/", http.StripPrefix("/web/", http.FileServer(http.Dir("web"))))
	mux.HandleFunc("/add", addHandler)
	mux.HandleFunc("/entries", entriesHandler)

	log.Printf("listening on %s", port)

	handler := cors.Default().Handler(mux)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
