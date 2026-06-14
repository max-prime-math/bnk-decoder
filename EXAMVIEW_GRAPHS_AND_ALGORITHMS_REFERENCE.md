# ExamView Graphs and Algorithms Reference

This file records observed ExamView behavior from the archived support docs, exported PDFs, and user-supplied UI screenshots from the Grade 12 Pre-Calculus banks.

## Algorithm Model

- Algorithm definitions are scoped to one question, a narrative and its linked questions, or a matching group and its contained questions.
- Definitions can be variables, constants, conditions, or user-defined functions.
- Only variables can be inserted directly into question text. Constants, conditions, and user-defined functions must be wrapped in variables if they need to display.
- Variable names begin with a letter, are at most 40 characters, and use letters, numbers, and underscores.
- Expressions are typed as `int`, `double`, or `string`.
- Arithmetic operators include `+`, `-`, `*`, `/`, `\`, `%`, `^`, and `!`.
- Relational/logical operators include `=`, `<`, `<=`, `>`, `>=`, `<>`, `&`, `|`, plus word forms such as `and` and `or`.
- Built-in functions seen or documented include `range`, `rand`, `choose`, `list`, `if`, `fracs`, `mixfracs`, `rfracs`, `comb`, `perm`, `sin`, `cos`, `tan`, `sqrt`, `pow`, `abs`, `format`, `sigfig`, and related math/string/statistical functions.

## Matching Groups

Matching groups are not ordinary adjacent short-answer questions. The group has its own editor, its own algorithm scope, a fixed `Questions` count, a fixed choice range, and an answer table.

Observed Chapter 03 group:

- UI title: `Matching - 1-4 of 4`
- Prompt: `Match the correct term with the correct part of the statement.`
- Choices: `A quotient`, `B remainder`, `C divisor`, `D dividend`
- Item rows:
  - `1 -> D`: dividend polynomial
  - `2 -> C`: divisor
  - `3 -> A`: quotient
  - `4 -> B`: remainder
- The group has 4 items. The previous decoder output incorrectly linked a later short-answer block as a fifth matching item.
- Algorithms are scoped to the group. The observed variables include `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `k`, `l`, `m`, `n`, `p`, a `Condition`, and `scramble`.

Observed Chapter 11 group:

- UI title: `Matching - 1-5 of 5`
- Prompt: `Match each value with the correct expression.`
- Choices include combinatorics expressions such as `r C r1`, `n1 C r1`, `r P r`, `n1 P r1`, `n!/r!`, `n1!/r1!`.
- Item rows map computed answer variables to choices:
  - `1 -> B`: `ans2`
  - `2 -> C`: `ans3`
  - `3 -> D`: `ans4`
  - `4 -> E`: `ans5`
  - `5 -> A`: `ans1`
- Algorithms include `n=range(4,12,1)`, `n1=range(4,12,1)`, `r=range(3,11,1)`, `r1=range(3,11,1)`, `d=n-r`, `d1=n1-r1`, `ans1=comb(n,r)`, `ans2=comb(n1,r1)`, `ans3=perm(n,r)`, `ans4=perm(n1,r1)`, `ans5=n!/r!`, and conditions enforcing valid/distinct values.

Decoder implication: matching-group recovery must prefer the explicit matching record boundary and row count over proximity-based linking.

## Cartesian Graphs

ExamView Cartesian graphs are structured objects. The Functions tab can contain multiple graph items. Documented item types include:

- `f(x)`
- `f(y)`
- `Parabola`
- `Circle`
- `Ellipse`
- `Hyperbola`
- `Point(x,y)`
- `Segment`
- `Polynomial`
- `Parametric`
- `Normal Curve`
- `Picture`
- `Shape`
- `Pie Chart`
- `Text Box`
- `Compound`

Graph item expressions use the same algorithmic syntax as variables. Variables can appear in function definitions, domains, display conditions, point coordinates, labels, and most item-specific attributes. Variables cannot be used for axis labels, units per tick, ticks per inch, ticks per label, width, height, or baseline.

Observed graph item fields:

- expression or item-specific coordinates
- relation: `=`, `<`, `<=`, `>`, `>=`
- domain
- display condition: the `Display ... only if` field
- line pattern
- color
- shading
- point style: none, solid, hollow
- label style: none, coordinates, custom text
- label position

Observed Axes/View tab defaults and examples:

- Standard radians trig option:
  - horizontal axis label `theta`, scale 1, ticks per inch 5, ticks per label 1
  - vertical axis label `y`, scale 1, ticks per inch 5, ticks per label 1
  - thin black axes, tick marks and tick labels shown
  - view width 2.3 in, height 2.3 in, baseline 0.1 in
  - lined black background, graph center `(0, 0)`
- Degree trig option:
  - horizontal axis label `x`, scale 180, ticks per inch 4, ticks per label 1
  - vertical axis label `y`, scale 1, ticks per inch 5, ticks per label 1
  - view width 2.3 in, height 2.3 in, baseline 0.1 in
  - lined black background, graph center `(0, 0)`
- Sinusoidal transformation option:
  - horizontal and vertical scales both 1, ticks per inch 5
  - view width 2.5 in, height 2.5 in, baseline 0.1 in
  - lined black background, graph center `(0, 0)`
- Composite sine/cosine graph:
  - horizontal axis scale 3, ticks per inch 5, ticks per label 1
  - vertical axis scale 0.25, ticks per inch 5, ticks per label 4
  - view width 4.0 in, height 4.0 in, baseline 4.0 in
  - lined black background, graph center `(0, 0)`
- Rational graph with hole:
  - horizontal and vertical scales both 1, ticks per inch 5
  - view width 2.5 in, height 2.5 in, baseline 0.1 in
  - lined black background, graph center `(0, 0)`
- Investment scatter plot:
  - horizontal axis label `t`, scale 0.5, ticks per inch 7, ticks per label 2
  - vertical axis label `V`, scale 50, ticks per inch 7, ticks per label 2
  - view width 2.5 in, height 2.5 in, baseline 1.8 in
  - lined black background, graph center `(3, 600)`

## Variable-Driven Graph Examples

Chapter 05 MC #5:

- Prompt uses `y = a sin(b theta)`, radians.
- Correct option graph uses `y = -1*a_graph*sin(b_graph*x)`.
- Algorithms include `a_num`, `a_denom`, `a_graph=a_num/a_denom`, `b_num`, `b_denom`, `b_graph=b_num/b_denom`, `period=2*pi/abs(b_graph)`, `amp=abs(a_graph)`, and a condition enforcing nonzero denominators and reasonable period/amplitude.

Chapter 05 MC #6:

- Prompt uses degrees.
- Correct option graph expression uses degree conversion: `y = a_graph*cos(b_graph*(pi*x/180))`.
- This is the canonical example proving the renderer must preserve `pi*x/180` for degree-mode trig graphs.

Chapter 05 MC #13:

- Prompt: `y = a*cos(b*(x+pi/c))-d`.
- Correct graph option uses exactly `y = a*cos(b*(x+pi/c))-d`.
- Variables include `a`, `b`, `c`, `d`, `ans`, `dis1`, `dis2`, `dis3`, `function`, `select_function`, and `scramble`.

Chapter 10 MC #8:

- Prompt: `h(x)=f(g(x))`, with `f(x)=func` and `g(x)=a(x+b)`.
- Graph has two function items:
  - `y = cos((a_num/a_denom)*(x+b))`, show only if `f_graph2`
  - `y = sin((a_num/a_denom)*(x+b))`, show only if `f_graph1`
- Decoder implication: graph items need a `displayCondition` field. We should not discard hidden conditional alternatives, because they explain how the same question template renders across recalculations.

Chapter 09 MC #11:

- Graph item 1: rational function `y = (x+c)/(a*x^2-e*x+f)`.
- Graph item 2: hollow point at `(hole, y_var)`.
- Decoder implication: holes are explicit point objects, not just visual artifacts inferred from the rational expression.

## Scatter Plots

Scatter plots in the observed bank are Cartesian graphs made of point objects, not opaque bitmaps.

Chapter 07 short-answer #7:

- The first scatter plot has point items such as `(1, 24)`, `(2, 14)`, `(3, 8.5)`, `(0, 40)`, `(4, 5)`, `(5, 3)`.
- Points use solid point style, label style `None`, black color, and no shading.

Chapter 07 short-answer #8:

- The investment scatter plot has point items:
  - `(0, 500)`
  - `(1, 550)`
  - `(2, 605)`
  - `(3, 666)`
  - `(4, 732)`
  - `(5, 805)`
  - `(6, 886)`
- Points are solid, unlabeled, black, and conditionless.

Decoder implication: a graph model must support point lists as first-class graph objects, not only sampled function curves.

## Number Lines

Observed Chapter 03 problem #14 uses a `Format Graph - Number Line` object.

- Functions tab contains:
  - `Ray -1 to the left`
  - `Ray 1 to the right`
- Ray edit dialog fields:
  - direction: left or right
  - endpoint coordinate
  - endpoint point style: none, solid, hollow, with parenthesis/bracket variants
  - label style: none, coordinate, or custom
  - label position
  - display condition
  - line pattern
  - color
  - shading
- In the observed solution, both endpoint styles are hollow and the ray color is red.
- Axes tab:
  - label blank
  - scale 1
  - ticks per inch 5
  - ticks per label 1
  - thin black axis
  - tick marks and tick labels shown
- View tab:
  - width 2.5 in
  - height 0.5 in
  - baseline 0.5 in
  - centered at coordinate 0

Decoder implication: `number-line` is a real graph family and needs a `ray` graph object kind.

## Pictures and Bitmaps

Some visuals are inserted pictures, not editable graphs.

Observed Chapter 11 route/grid diagram:

- `Format Picture` shows `Current: 256-color bitmap`.
- `Optimal: 256-color bitmap`.
- Memory size is shown as 114 KB.
- Crop fields exist for left, right, top, and bottom.

Decoder implication: picture objects should stay as extracted bitmap assets when possible. They are not graph objects unless the embedded payload actually contains graph structure.

## PDF Reference Workflow

The higher quality PDFs in `ignore/examples` should be treated as visual/text oracles:

- `pdftotext -layout` recovers printed stems, answers, and metadata.
- `pdftotext -bbox-layout` gives word positions for crop/index work.
- `pdftoppm` renders pages sharply enough for visual QA and exact fallback crops.
- `pdfimages -list` confirms many high-resolution embedded image objects.

The PDFs are not semantic graph sources. BNK remains the source for algorithm definitions and editable graph structure. The PDFs are the best reference for verification and fallback visual preservation.
