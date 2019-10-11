
import * as vega from 'vega';
import SPARQL from 'vega-transform-sparql';

const specQueryingUnics = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 700,
  "height": 500,
  "padding": 5,

  "data": [
    {
      "name": "table",
      "transform": [
        {
          "type": "sparql",
          "endpoint": "http://ec2-52-51-177-228.eu-west-1.compute.amazonaws.com/toscana_2.0/sparql/query",
          "query": `PREFIX : <http://www.semanticweb.org/ontologies/2016/4/untitled-ontology-69#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX dce: <http://purl.org/dc/elements/1.1/#>
          SELECT distinct 
          ?year 
          ?totalFemale 
          ?totalForeignFemale 
          ?totalForeignMale 
          ?totalMale
          ?organizationName
          WHERE {
            ?iscritti a :USTAT-Postgraduate-Iscritti .
            ?iscritti :academicYear ?year .
            ?iscritti :totalFemale ?totalFemale .
            ?iscritti :totalFemale ?totalForeignFemale .
            ?iscritti :totalFemale ?totalMale .
            ?iscritti :totalFemale ?totalForeignMale .
            ?iscritti :organization ?organization . 
            ?organization :extendedName ?organizationName
          }
          LIMIT 200`
        },
        {
          "type": "formula",
          "expr": "datum.totalMale + datum.totalFemale",
          "as": "amount"
        },
        {
          "type": "aggregate",
          "groupby": ["organizationName"],
          "fields": ["amount"],
          "ops": ["sum"],
          "as": ["amount"]
        },
        {
          "type": "collect",
          "sort": {
            "field": "amount",
            "order": "descending"
          }
        }
      ]
    }
  ],

  "signals": [
    {
      "name": "tooltip",
      "value": {},
      "on": [
        {"events": "rect:mouseover", "update": "datum"},
        {"events": "rect:mouseout",  "update": "{}"}
      ]
    }
  ],

  "scales": [
    {
      "name": "yscale",
      "type": "band",
      "domain": {"data": "table", "field": "organizationName"},
      "range": "height",
      "padding": 0.65,
      "round": true
    },
    {
      "name": "xscale",
      "domain": {"data": "table", "field": "amount"},
      "nice": true,
      "range": "width"
    },
    {
      "name": "color",
      "type": "linear",
      "zero": true,
      "domain": {"data": "table", "field": "amount"},
      "range": "heatmap"
    }
  ],

  "axes": [
    { "orient": "bottom", "scale": "xscale" },
    { "orient": "left", "scale": "yscale" }
  ],

  "marks": [
    {
      "type": "rect",
      "from": {"data":"table"},
      "encode": {
        "enter": {
          "width": {"scale": "xscale", "field": "amount"},
          "height": {"scale": "yscale", "band": 1},
          "y": {"scale": "yscale", "field": "organizationName"},
          "x": {"scale": "xscale", "value": 0}
        },
        "update": {
          "fill": {"scale": "color", "field": "amount"}
        },
        "hover": {
          "fill": {"value": "red"}
        }
      }
    }
  ]
};




const specQueryingWikidata = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "width": 700,
  "height": 400,
  "padding": 5,
  "config": {
    "axisY": {
      "titleX": -2,
      "titleY": 410,
      "titleAngle": 0,
      "titleAlign": "right",
      "titleBaseline": "top"
    }
  },
  "data": [
    {
      "name": "element_dimensions",
      "transform": [
        {
          "type": "sparql",
          "endpoint": "https://query.wikidata.org/sparql",
          "query": `SELECT ?elementLabel ?boiling_point ?melting_point ?electronegativity ?density ?mass WHERE {
            ?element wdt:P31 wd:Q11344;
               wdt:P2102 ?boiling_point;
               wdt:P2101 ?melting_point;
               wdt:P1108 ?electronegativity;
               wdt:P2054 ?density;
               wdt:P2067 ?mass.
              SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
            }
            LIMIT 100`
        }
      ]      
    },
    {
      "name": "fields",
      "values": [
        "electronegativity",
        "boiling_point",
        "density",
        "melting_point",
        "mass",
        "elementLabel"
      ]
    }
  ],
  "scales": [
    {
      "name": "ord",
      "type": "point",
      "range": "width",
      "round": true,
      "domain": {"data": "fields", "field": "data"}
    },
    {
      "name": "electronegativity",
      "type": "linear",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "electronegativity"}
    },
    {
      "name": "boiling_point",
      "type": "linear",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "boiling_point"}
    },
    {
      "name": "density",
      "type": "linear",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "density"}
    },
    {
      "name": "melting_point",
      "type": "linear",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "melting_point"}
    },
    {
      "name": "mass",
      "type": "linear",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "mass"}
    },
    {
      "name": "elementLabel",
      "type": "band",
      "range": "height",
      "zero": false,
      "nice": true,
      "domain": {"data": "element_dimensions", "field": "elementLabel"}
    }
  ],
  "axes": [
        {
      "orient": "left",
      "zindex": 1,
      "scale": "elementLabel",
      "title": "elementLabel",
      "offset": {"scale": "ord", "value": "elementLabel", "mult": -1}
    },
    {
      "orient": "left",
      "zindex": 1,
      "scale": "electronegativity",
      "title": "electronegativity",
      "offset": {"scale": "ord", "value": "electronegativity", "mult": -1}
    },
    {
      "orient": "left",
      "zindex": 1,
      "scale": "boiling_point",
      "title": "boiling_point",
      "offset": {"scale": "ord", "value": "boiling_point", "mult": -1}
    },
    {
      "orient": "left",
      "zindex": 1,
      "scale": "density",
      "title": "density",
      "offset": {"scale": "ord", "value": "density", "mult": -1}
    },
    {
      "orient": "left",
      "zindex": 1,
      "scale": "melting_point",
      "title": "melting_point",
      "offset": {"scale": "ord", "value": "melting_point", "mult": -1}
    },
    {
      "orient": "left",
      "zindex": 1,
      "scale": "mass",
      "title": "mass",
      "offset": {"scale": "ord", "value": "mass", "mult": -1}
    }
  ],
  "marks": [
    {
      "type": "group",
      "from": {"data": "element_dimensions"},
      "marks": [
        {
          "type": "line",
          "from": {"data": "fields"},
          "encode": {
            "enter": {
              "x": {"scale": "ord", "field": "data"},
              "y": {
                "scale": {"datum": "data"},
                "field": {"parent": {"datum": "data"}}
              },
              "stroke": {"value": "steelblue"},
              "strokeWidth": {"value": 1.01},
              "strokeOpacity": {"value": 0.3}
            }
          }
        }
      ]
    }
  ]
};

vega.transforms['sparql'] = SPARQL;

// now you can use the transform in a Vega spec
const view = new vega.View(vega.parse(specQueryingUnics)).initialize(document.querySelector("#vis-endpoint-unics"));
const view2 = new vega.View(vega.parse(specQueryingWikidata)).initialize(document.querySelector("#vis-endpoint-wikidata"));

view.runAsync();
view2.runAsync();
