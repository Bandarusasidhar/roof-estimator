# Decisions

## Assumptions

The brief did not specify an exact visual design, so I chose a clean, simple, responsive layout for the public estimator and a straightforward configuration-focused layout for the owner panel. The goal was to make the estimator easy for a homeowner to complete on a phone and the owner panel understandable to a non-technical user.

I treated the supplied configuration as the starting point and kept estimator questions, labels, options, and pricing values in the database. The React frontend requests the configuration from the backend at runtime instead of defining those values itself.

I used HTTP Basic Authentication for the owner panel because the brief explicitly allows Basic Auth and the task is not intended to be a full security exercise.

## Calculation

## Calculation Formula

The estimate is calculated entirely on the server using the active configuration stored in MongoDB. The frontend only submits the customer's answers and does not contain the pricing calculation.

First, the roof area is converted to a number and the selected material, roof pitch, existing roofing layers, and number of stories are looked up from the active configuration.

The calculation is:

Base Material Cost = Roof Area × Material Rate × (1 + Waste Factor)

Tear-Off Cost = Roof Area × Tear-Off Rate

Adjusted Subtotal =
(Base Material Cost + Tear-Off Cost)
× Pitch Multiplier
× Stories Multiplier

Mid Estimate = Adjusted Subtotal + Permit Flat Fee

The estimate range is then calculated using the configured range spread percentage:

Estimate Low = round(Mid Estimate × (1 − Range Spread))

Estimate High = round(Mid Estimate × (1 + Range Spread))

The range spread percentage from the configuration is converted from a percentage to a decimal before it is used. For example, a configured value of 12 means a 12% spread.

The final low and high values are rounded to the nearest whole number and stored with the lead together with the submitted answers and configuration version.


## What I Deliberately Did Not Build

I did not build optional stretch features such as configuration version history, CSV lead export, outbound webhooks, adding completely new question types, or a dedicated automated test suite around the calculation layer.

These were intentionally kept out of the 24-hour scope so that the required estimator, server-side calculation, MongoDB persistence, authenticated owner panel, configuration editing, lead capture, and deployment could be completed and tested properly before adding optional features.

## Questionable Seed Data or Brief Details

The supplied seed data contains historical leads whose answers do not necessarily match the current configuration. For example, one historical lead contains values such as slate_natural, chimney_count, and gutter_replace, while the current configuration contains a smaller set of questions.

I treated those records as historical data rather than changing the current configuration to accommodate them. This keeps the current estimator driven by the current configuration while preserving the supplied lead information.

The brief also leaves the exact calculation formula open. I therefore chose a deterministic server-side calculation based on the supplied configurable rates and modifiers rather than attempting to reproduce historical estimates.

## Questions I Would Ask Dale

Before a production build, I would ask Dale:

1. Should the estimate be presented as a single price or always as a range?
2. Should the owner be able to add completely new questions, or only edit and activate/deactivate existing questions?
3. What should happen when a customer changes an answer after moving through several estimator steps?
4. Should captured leads have statuses such as new, contacted, quoted, or closed?
5. Should the owner panel support multiple users with different permissions?
6. What retention period and privacy requirements apply to customer contact information?
7. Should the estimate calculation include additional real-world factors such as gutters, chimneys, skylights, disposal fees, or geographic pricing?

## If I Had Another Week

I would add configuration version history so the owner can see what changed and when. I would also add CSV export for captured leads, automated tests for the calculation layer and validation rules, and the ability for the owner to create new questions from the panel.

I would also improve the owner-panel editing experience further and add stronger authentication and authorization suitable for a production business application.