namespace ordermanagement;

entity SalesQuote {
    key ID : String;
        name : String;
        // Weitere Felder können hier hinzugefügt werden
}

service SalesQuoteAPI {
    entity SalesQuote as projection on ordermanagement.SalesQuote;
}