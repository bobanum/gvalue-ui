# Number `input` Web Component

This component is a custom `input` element that allows the user to input numbers with various features such as incrementing/decrementing, accepting formulas, and localized input.

## Features

- [ctrl-ArrowUp/Down] to increment/decrement by 1 tenth of step
- [shift-ArrowUp/Down] to increment/decrement by 10 times step
- [escape] to blur and reset to last value
- [enter] to blur and commit (go to next input)
- [home] to set value to min and commit
- [end] to set value to max and commit
- [tab] to commit value and go to next input
- Accepts formulas (calculated on commit)
- Accepts localized input (e.g. 1.000,00 in Germany)
- Accepts "formatted" display. Ex.: "100,00$" when blurred and "100" when focused.
