# Humanise User Interface Guidelines

## Principles

* Be kind
* Listen
* Help
* Do no harm

## Naming

### Sizes

* giga (proposed)
* huge
* large 
* regular 26
* small 20
* mini 16
* tiny 14
* micro (proposed)

Sizes should probably either be set as booleans mini=true or size="mini" both should be possible.

Maybe sizes should be inherited in some cases – maybe config via inherit: true/false

### Themes

* Regular (Chrome)
* Light
* Dark

### Bare

A "bare" component should have no "appearance" but should still be positioned and sized and behave correctly.

### Events

* click!
* show! (not open)
* hide! (not close)

tell | invoke | call | emit | signal | trigger
listen | observe | receive

## States

* normal
* disabled
* highlighted

## Classes

hui_button hui-small hui-is-disabled

hui_structure_top

Maybe distinguish between state and appearance

State: on/of enabled/disabled
Size: small/large
Appearance: dark/light/plain