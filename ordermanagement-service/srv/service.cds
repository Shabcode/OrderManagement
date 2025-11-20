using { ordermanagement.SalesQuote } from './ordermanagement-service';

service SalesQuoteService @(path: '/sap/c4c/api/v1/sales-quote-service/salesQuotes') {
    entity Quotes as projection on SalesQuote;
}