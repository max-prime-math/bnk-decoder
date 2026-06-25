# Record Inspection: Chapter 02.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 02.bnk`
- Inflated bytes: 727063
- Records: 65
- Inline slots: 312
- Slot classes: variable-ref=209, unknown-object=60, math-object=31, diagram-object=10, fixed-value=2

## record-1 @ 4628

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | vertical translation
- Counts: strings=112, variables=4, display=5, refs=28, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated [[slot]] units [[slot]] [[slot]] units to the left [[slot]] units to the right [[slot]] units [[slot]]
```

Choices:
- A. [[slot]] units [[slot]]
- B. [[slot]] units to the right
- C. [[slot]] units to the left
- D. [[slot]] units [[slot]]

Variables:
- k = – 2  rule: `range(-10,10,1)`
- ANS_units = 2  rule: `abs(k)`
- ANS_direction = down  rule: `if(k>0,"up","down")`
- DIS_direction = up  rule: `if(k<0,"up","down")`

Inline slots:
- #1 variable-ref ref=k value=– 2 offset=5468
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #2 variable-ref ref=ANS_units value=2 offset=5526
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #3 variable-ref ref=DIS_direction value=up offset=5562
  context: [[slot]] units [[slot]]
- #4 variable-ref ref=ANS_units value=2 offset=5578
  context: [[slot]] units [[slot]]
- #5 variable-ref ref=ANS_units value=2 offset=5586
  context: [[slot]] units to the left
- #6 variable-ref ref=ANS_units value=2 offset=5632
  context: [[slot]] units to the right
- #7 variable-ref ref=ANS_direction value=down offset=5678
  context: [[slot]] units [[slot]]
- #8 unknown-object ref=- value=- offset=5694
  context: [[slot]] units [[slot]]

## record-2 @ 9471

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | vertical translation
- Counts: strings=107, variables=4, display=5, refs=26, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated [[slot]] units to the left [[slot]] units to the right [[slot]] units [[slot]] [[slot]] units [[slot]]
```

Choices:
- A. [[slot]] units to the left
- B. [[slot]] units [[slot]]
- C. [[slot]] units to the right
- D. [[slot]] units [[slot]]

Variables:
- k = + 8  rule: `range(-10,10,1)`
- ANS_units = 8  rule: `abs(k)`
- ANS_direction = down  rule: `if(k<0,"up","down")`
- DIS_direction = up  rule: `if(k>0,"up","down")`

Inline slots:
- #1 variable-ref ref=k value=+ 8 offset=10317
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #2 variable-ref ref=ANS_units value=8 offset=10375
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #3 variable-ref ref=ANS_units value=8 offset=10411
  context: [[slot]] units to the left
- #4 variable-ref ref=ANS_units value=8 offset=10455
  context: [[slot]] units to the right
- #5 variable-ref ref=DIS_direction value=up offset=10503
  context: [[slot]] units [[slot]]
- #6 variable-ref ref=ANS_units value=8 offset=10519
  context: [[slot]] units [[slot]]
- #7 variable-ref ref=ANS_direction value=down offset=10527
  context: [[slot]] units [[slot]]
- #8 unknown-object ref=- value=- offset=10543
  context: [[slot]] units [[slot]]

## record-3 @ 14320

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation
- Counts: strings=113, variables=4, display=5, refs=30, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated [[slot]] units down [[slot]] units [[slot]] [[slot]] units [[slot]] [[slot]] units up
```

Choices:
- A. [[slot]] units down
- B. [[slot]] units [[slot]]
- C. [[slot]] units [[slot]]
- D. [[slot]] units up

Variables:
- h = – 5  rule: `range(-10,10,1)`
- ANS_units = 5  rule: `abs(h)`
- ANS_direction = right  rule: `if(h>0,"left","right")`
- DIS_direction = left  rule: `if(h<0,"left","right")`

Inline slots:
- #1 variable-ref ref=h value=– 5 offset=15182
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #2 variable-ref ref=ANS_units value=5 offset=15240
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #3 variable-ref ref=ANS_units value=5 offset=15276
  context: [[slot]] units down
- #4 variable-ref ref=ANS_direction value=right offset=15306
  context: [[slot]] units [[slot]]
- #5 variable-ref ref=ANS_units value=5 offset=15322
  context: [[slot]] units [[slot]]
- #6 variable-ref ref=DIS_direction value=left offset=15332
  context: [[slot]] units [[slot]]
- #7 variable-ref ref=ANS_units value=5 offset=15348
  context: [[slot]] units [[slot]]
- #8 unknown-object ref=- value=- offset=15356
  context: [[slot]] units up

## record-4 @ 19151

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal stretch
- Counts: strings=124, variables=3, display=8, refs=32, slots=11, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
not reflected reflected in the y-axis [[slot]] Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is compressed by a factor of [[slot]] and [[slot]] stretched by a factor of [[slot]] and [[slot]] compressed by a factor of [[slot]] and [[slot]] stretched by a factor of [[slot]] and [[slot]]
```

Choices:
- A. compressed by a factor of [[slot]] and [[slot]]
- B. stretched by a factor of [[slot]] and [[slot]]
- C. compressed by a factor of [[slot]] and [[slot]]
- D. stretched by a factor of [[slot]] and [[slot]]

Variables:
- b = 5  rule: `range(-10,10,1)`
- ANS_units = 1/5  rule: `fracs(1,c)`
- ANS_reflection = ?  rule: `if(b>0,"not reflected","reflected in the y-axis")`

Inline slots:
- #1 variable-ref ref=b value=5 offset=20126
  context: [[slot]]
- #2 variable-ref ref=ANS_units value=1/5 offset=20271
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is
- #3 variable-ref ref=ANS_reflection value=if(b>0,"not reflected","reflected in the y-axis") offset=20329
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is
- #4 variable-ref ref=ANS_units value=1/5 offset=20395
  context: compressed by a factor of [[slot]] and [[slot]]
- #5 variable-ref ref=ANS_reflection value=if(b>0,"not reflected","reflected in the y-axis") offset=20407
  context: compressed by a factor of [[slot]] and [[slot]]
- #6 unknown-object ref=- value=- offset=20467
  context: stretched by a factor of [[slot]] and [[slot]]
- #7 unknown-object ref=- value=- offset=20479
  context: stretched by a factor of [[slot]] and [[slot]]
- #8 unknown-object ref=- value=- offset=20541
  context: compressed by a factor of [[slot]] and [[slot]]
- #9 unknown-object ref=- value=- offset=20553
  context: compressed by a factor of [[slot]] and [[slot]]
- #10 unknown-object ref=- value=- offset=20613
  context: stretched by a factor of [[slot]] and [[slot]]
- #11 unknown-object ref=- value=- offset=20625
  context: stretched by a factor of [[slot]] and [[slot]]

## record-5 @ 24654

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal stretch | reflection
- Counts: strings=138, variables=5, display=5, refs=27, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
When b [[slot]] 0, the function [[slot]] has what relationship to the base function [[slot]]? f(x) is [[slot]] f(x) is [[slot]] f(x) is [[slot]] f(x) is [[slot]]
```

Choices:
- A. f(x) is [[slot]]
- B. f(x) is [[slot]]
- C. f(x) is [[slot]]
- D. f(x) is [[slot]]

Variables:
- sign = <  rule: `choose(rand(2),">","<")`
- dis3 = stretched vertically by a factor of |b| and reflected in the x-axis  rule: `if(sign=">","stretched vertically by a factor of |b|","stretched vertically by a factor of |b| and reflected in the x-axis")`
- dis1 = stretched vertically by a factor of |b|  rule: `if(sign=">","stretched vertically by a factor of |b| and reflected in the x-axis", "stretched vertically by a factor of |b|")`
- dis2 = stretched horizontally by a factor of 1/|b|  rule: `if(sign=">","stretched horizontally by a factor of 1/|b| and reflected in the y-axis", "stretched horizontally by a factor of 1/|b|")`
- ans = stretched horizontally by a factor of 1/|b| and reflected in the y-axis  rule: `if(sign=">","stretched horizontally by a factor of 1/|b|","stretched horizontally by a factor of 1/|b| and reflected in the y-axis")`

Inline slots:
- #1 variable-ref ref=sign value=< offset=26778
  context: When b [[slot]] 0, the function [[slot]] has what relationship to the base function [[slot]]?
- #2 variable-ref ref=dis2 value=stretched horizontally by a factor of 1/|b| offset=26814
  context: When b [[slot]] 0, the function [[slot]] has what relationship to the base function [[slot]]?
- #3 variable-ref ref=ans value=stretched horizontally by a factor of 1/|b| and reflected in the y-axis offset=26904
  context: When b [[slot]] 0, the function [[slot]] has what relationship to the base function [[slot]]?
- #4 variable-ref ref=dis1 value=stretched vertically by a factor of |b| offset=26932
  context: f(x) is [[slot]]
- #5 variable-ref ref=dis3 value=stretched vertically by a factor of |b| and reflected in the x-axis offset=26958
  context: f(x) is [[slot]]
- #6 unknown-object ref=- value=- offset=26984
  context: f(x) is [[slot]]
- #7 unknown-object ref=- value=- offset=27010
  context: f(x) is [[slot]]

## record-6 @ 30711

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | vertical stretch
- Counts: strings=102, variables=4, display=5, refs=27, slots=12, visibleChoices=4

```text
When the graph of [[slot]] is vertically stretched by a factor of [[slot]], the point ([[slot]], [[slot]]) will be translated to the point ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]])
```

Choices:
- A. ([[slot]], [[slot]])
- B. ([[slot]], [[slot]])
- C. ([[slot]], [[slot]])
- D. ([[slot]], [[slot]])

Variables:
- a = 3  rule: `range(-20,20,1)`
- x = 9  rule: `range(-20,20,1)`
- y = –10  rule: `range(-20,20,1)`
- y_ans = –30  rule: `y*a`

Inline slots:
- #1 variable-ref ref=y value=–10 offset=31439
  context: When the graph of [[slot]] is vertically stretched by a factor of [[slot]], the point ([[slot]], [[slot]]) will be t
- #2 variable-ref ref=x value=9 offset=31521
  context: When the graph of [[slot]] is vertically stretched by a factor of [[slot]], the point ([[slot]], [[slot]]) will be translated to the point
- #3 variable-ref ref=a value=3 offset=31549
  context: When the graph of [[slot]] is vertically stretched by a factor of [[slot]], the point ([[slot]], [[slot]]) will be translated to the point
- #4 variable-ref ref=x value=9 offset=31555
  context: e graph of [[slot]] is vertically stretched by a factor of [[slot]], the point ([[slot]], [[slot]]) will be translated to the point
- #5 variable-ref ref=y value=–10 offset=31633
  context: ([[slot]], [[slot]])
- #6 variable-ref ref=y value=–10 offset=31639
  context: ([[slot]], [[slot]])
- #7 variable-ref ref=x value=9 offset=31653
  context: ([[slot]], [[slot]])
- #8 variable-ref ref=a value=3 offset=31659
  context: ([[slot]], [[slot]])
- #9 variable-ref ref=y_ans value=–30 offset=31673
  context: ([[slot]], [[slot]])
- #10 variable-ref ref=y_ans value=–30 offset=31679
  context: ([[slot]], [[slot]])
- #11 variable-ref ref=x value=9 offset=31693
  context: ([[slot]], [[slot]])
- #12 variable-ref ref=x value=9 offset=31699
  context: ([[slot]], [[slot]])

## record-7 @ 35317

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | graph | vertical stretch | reflection
- Counts: strings=150, variables=7, display=5, refs=30, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which of the graphs shown below represents the base function [[slot]] (in black) and the stretched function g(x) = [[slot]][[slot]] (in red)? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = –9  rule: `range(-9,9,1)`
- d = 6  rule: `range(-9,9,1)`
- a = -3/2  rule: `fracs(n,d)`
- dis1 = 1.5  rule: `-n/d`
- dis2 = –0.666666666667  rule: `d/n`
- dis3 = 0.666666666667  rule: `-d/n`
- h = ?  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=h value=[[slot]] offset=36365
  context: Which of the graphs shown below represents the base function [[slot]] (in black) and the stretched function g(x) = [[slot]][[slot]] (in red)?
- #2 variable-ref ref=d value=6 offset=36459
  context: below represents the base function [[slot]] (in black) and the stretched function g(x) = [[slot]][[slot]] (in red)?
- #3 variable-ref ref=d value=6 offset=36461
  context: epresents the base function [[slot]] (in black) and the stretched function g(x) = [[slot]][[slot]] (in red)?
- #4 variable-ref ref=d value=6 offset=36493
  context: [[slot]]
- #5 variable-ref ref=d value=6 offset=36501
  context: [[slot]]
- #6 variable-ref ref=a value=-3/2 offset=36511
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=36519
  context: [[slot]]

## record-8 @ 63518

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation | vertical translation
- Counts: strings=111, variables=8, display=5, refs=25, slots=20, visibleChoices=4

```text
Given the function [[slot]] with a domain of [[slot]] and a range of [[slot]], which of the following best describes the vertical and horizontal translations with respect to the graph of [[slot]]? [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
```

Choices:
- A. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- B. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- C. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- D. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]

Variables:
- h = –5  rule: `range(-9,9,1)`
- k = 8  rule: `range(-9,9,1)`
- h_value = 5  rule: `abs(h)`
- h_direction = left  rule: `if(h<0,"left","right")`
- k_value = 8  rule: `abs(k)`
- k_direction = up  rule: `if(k<0,"down","up")`
- dis1 = left  rule: `if(h<0,"left","right")`
- dis2 = down  rule: `if(k<0,"up","down")`

Inline slots:
- #1 variable-ref ref=h value=–5 offset=64774
  context: Given the function [[slot]] with a domain of [[slot]] and a range of [[slot]], which of the following best describes
- #2 variable-ref ref=k value=8 offset=64812
  context: Given the function [[slot]] with a domain of [[slot]] and a range of [[slot]], which of the following best describes the vertical and horizonta
- #3 variable-ref ref=h value=–5 offset=64846
  context: Given the function [[slot]] with a domain of [[slot]] and a range of [[slot]], which of the following best describes the vertical and horizontal translations with resp
- #4 variable-ref ref=k value=8 offset=65068
  context: wing best describes the vertical and horizontal translations with respect to the graph of [[slot]]?
- #5 variable-ref ref=h_value value=5 offset=65078
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #6 variable-ref ref=h_direction value=left offset=65108
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #7 variable-ref ref=k_value value=8 offset=65120
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #8 variable-ref ref=k_direction value=up offset=65136
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #9 variable-ref ref=k_value value=8 offset=65144
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #10 variable-ref ref=h_direction value=left offset=65174
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #11 variable-ref ref=h_value value=5 offset=65186
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #12 variable-ref ref=k_direction value=up offset=65202
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #13 variable-ref ref=k_value value=8 offset=65212
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #14 variable-ref ref=dis1 value=left offset=65242
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #15 variable-ref ref=h_value value=5 offset=65254
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #16 variable-ref ref=dis2 value=down offset=65270
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #17 variable-ref ref=h_value value=5 offset=65278
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #18 variable-ref ref=dis1 value=left offset=65308
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #19 variable-ref ref=k_value value=8 offset=65320
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #20 variable-ref ref=dis2 value=down offset=65336
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]

## record-9 @ 70456

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation | vertical translation
- Counts: strings=143, variables=2, display=6, refs=37, slots=18, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
abs(h)>1 and abs(k)>1 and abs(h)<>abs(k) Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]] [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
```

Choices:
- A. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- B. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- C. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- D. [[slot]] units to the [[slot]] and [[slot]] units [[slot]]

Variables:
- h = + 8  rule: `range(-9,9,1)`
- k = – 4  rule: `range(-9,9,1)`

Inline slots:
- #1 variable-ref ref=h value=+ 8 offset=71768
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #2 variable-ref ref=k value=– 4 offset=71826
  context: Compared to the graph of the base function [[slot]], the graph of the function [[slot]] is translated
- #3 unknown-object ref=- value=- offset=71862
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #4 unknown-object ref=- value=- offset=71892
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #5 unknown-object ref=- value=- offset=71904
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #6 unknown-object ref=- value=- offset=71920
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #7 unknown-object ref=- value=- offset=71928
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #8 unknown-object ref=- value=- offset=71958
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #9 unknown-object ref=- value=- offset=71970
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #10 unknown-object ref=- value=- offset=71986
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #11 unknown-object ref=- value=- offset=71996
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #12 unknown-object ref=- value=- offset=72026
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #13 unknown-object ref=- value=- offset=72038
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #14 unknown-object ref=- value=- offset=72054
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #15 unknown-object ref=- value=- offset=72062
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #16 unknown-object ref=- value=- offset=72092
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #17 unknown-object ref=- value=- offset=72104
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]
- #18 unknown-object ref=- value=- offset=72120
  context: [[slot]] units to the [[slot]] and [[slot]] units [[slot]]

## record-10 @ 77494

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | vertical translation | graph
- Counts: strings=112, variables=7, display=6, refs=26, slots=6, visibleChoices=5

```text
Given the graph of f(x) shown below, what are the coordinates of point A if the equation of the transformed function is [[slot]]?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. ~

Variables:
- k = + 5  rule: `range(-5,5,1)`
- x_dis1 = –1  rule: `x1-k`
- x_dis2 = 9  rule: `x1+k`
- x1 = 4  rule: `choose(rand(3),1,4,9)`
- y1 = 2  rule: `sqrt(x1)`
- y_ans = 7  rule: `(y1+k)`
- y_dis = –3  rule: `y1-k`

Inline slots:
- #1 variable-ref ref=k value=+ 5 offset=78628
  context: if the equation of the transformed function is [[slot]]? [[slot]]
- #2 variable-ref ref=x1 value=4 offset=78634
  context: if the equation of the transformed function is [[slot]]? [[slot]]
- #3 variable-ref ref=y1 value=2 offset=78644
  context: [[slot]]
- #4 variable-ref ref=x_dis1 value=–1 offset=78652
  context: [[slot]]
- #5 variable-ref ref=y_ans value=7 offset=78662
  context: [[slot]]
- #6 variable-ref ref=x1 value=4 offset=78670
  context: [[slot]]

## record-11 @ 89478

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation | vertical translation | vertical stretch | horizontal stretch | graph | reflection
- Counts: strings=124, variables=6, display=5, refs=22, slots=5, visibleChoices=4

```text
What is the equation of the radical function shown in the graph below?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –2  rule: `range(-3,3,1)`
- b = –3  rule: `range(-5,5,1)`
- k = – 5  rule: `range(-6,6,1)`
- h = – 3  rule: `range(-6,6,1)`
- k_dis = + 5  rule: `-k`
- h_dis = + 3  rule: `-h`

Inline slots:
- #1 variable-ref ref=k value=– 5 offset=90728
  context: What is the equation of the radical function shown in the graph below? [[slot]]
- #2 variable-ref ref=a value=–2 offset=90738
  context: [[slot]]
- #3 variable-ref ref=b value=–3 offset=90746
  context: [[slot]]
- #4 variable-ref ref=k value=– 5 offset=90756
  context: [[slot]]
- #5 variable-ref ref=h value=– 3 offset=90764
  context: [[slot]]

## record-12 @ 99658

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation | vertical translation
- Counts: strings=92, variables=6, display=5, refs=18, slots=6, visibleChoices=4

```text
What is the equation of the transformed function, g(x), after the transformations are applied to the graph of the base function [[slot]], shown in blue, to obtain the graph of g(x), shown in red? [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 2 3 4 5

Variables:
- k = + 4  rule: `range(-6,6,1)`
- h = + 5  rule: `range(-6,6,1)`
- h_units = 5  rule: `abs(h)`
- k_units = 4  rule: `abs(k)`
- h_direction = left  rule: `if(h<0,"right","left")`
- k_direction = up  rule: `if(k<0,"down","up")`

Inline slots:
- #1 variable-ref ref=k value=+ 4 offset=100936
  context: d function, g(x), after the transformations are applied to the graph of the base function [[slot]], shown in blue, to obtain the graph of g(x), shown in red? [[slot]]
- #2 variable-ref ref=k value=+ 4 offset=101060
  context: of the base function [[slot]], shown in blue, to obtain the graph of g(x), shown in red? [[slot]]
- #3 variable-ref ref=h value=+ 5 offset=101070
  context: [[slot]]
- #4 variable-ref ref=k value=+ 4 offset=101078
  context: [[slot]]
- #5 variable-ref ref=k value=+ 4 offset=101088
  context: [[slot]]
- #6 variable-ref ref=h value=+ 5 offset=101096
  context: [[slot]]

## record-13 @ 110180

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | horizontal translation | vertical translation | reflection
- Counts: strings=135, variables=10, display=5, refs=24, slots=17, visibleChoices=4

```text
In the following graph, what transformations must be applied to the blue curve to obtain the red curve?[[slot]] a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]] a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]] a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]] a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
```

Choices:
- A. a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- B. a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- C. a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- D. a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]

Variables:
- h = 5  rule: `range(-5,5,1)`
- k = 3  rule: `range(-5,5,1)`
- vert_direction = up  rule: `if(k<0,"down","up")`
- up = ?  rule: `[[slot]]`
- horiz_direction = right  rule: `if(h<0,"left","right")`
- h_display = 5  rule: `abs(h)`
- k_dsiplay = 3  rule: `abs(k)`
- vert_direc_dis = down  rule: `if(k<0,"up","down")`
- down = ?  rule: `[[slot]]`
- horis_direc_dis = left  rule: `if(h<0,"right","left")`

Inline slots:
- #1 variable-ref ref=h value=5 offset=111712
  context: ng graph, what transformations must be applied to the blue curve to obtain the red curve? [[slot]]
- #2 variable-ref ref=h_display value=5 offset=111822
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #3 variable-ref ref=vert_direction value=up offset=111838
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #4 variable-ref ref=k_dsiplay value=3 offset=111902
  context: the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #5 variable-ref ref=horiz_direction value=right offset=111932
  context: l translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #6 variable-ref ref=h_display value=5 offset=112044
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #7 variable-ref ref=vert_direc_dis value=down offset=112060
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #8 variable-ref ref=k_dsiplay value=3 offset=112124
  context: the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #9 variable-ref ref=horiz_direction value=right offset=112154
  context: l translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #10 variable-ref ref=k_dsiplay value=3 offset=112266
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #11 variable-ref ref=vert_direction value=up offset=112282
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #12 variable-ref ref=h_display value=5 offset=112346
  context: the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #13 variable-ref ref=horis_direc_dis value=left offset=112376
  context: l translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #14 variable-ref ref=k_dsiplay value=3 offset=112488
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #15 variable-ref ref=vert_direction value=up offset=112504
  context: a reflection in the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #16 variable-ref ref=h_display value=5 offset=112568
  context: the x-axis, a vertical translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]
- #17 variable-ref ref=horiz_direction value=right offset=112598
  context: l translation [[slot]] units [[slot]], and a horizontal translation [[slot]] units to the [[slot]]

## record-14 @ 123056

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | reflection
- Counts: strings=90, variables=7, display=5, refs=11, slots=4, visibleChoices=4

```text
The two functions in the graph shown are reflections of each other. Select the type of reflection(s).[[slot]] a reflection in the [[slot]] a reflection in the line y = x a reflection in the [[slot]] a reflection in the [[slot]]
```

Choices:
- A. a reflection in the [[slot]]
- B. a reflection in the [[slot]]
- C. a reflection in the line y = x
- D. a reflection in the [[slot]]

Variables:
- x_axis = 1  rule: `choose(rand(2),-1,1)`
- y_axis = –1  rule: `if(x_axis=1,-1,choose(rand(2),1,-1))`
- ans = y-axis  rule: `if((x_axis=-1 and y_axis=-1),"x-axis and the y-axis",if((x_axis=-1 and y_axis=1),"x-axis","y-axis"))`
- dis1 = x-axis and the y-axis  rule: `if((x_axis=-1 and y_axis=-1),"x-axis",if((x_axis=-1 and y_axis=1),"y-axis","x-axis and the y-axis"))`
- dis2 = x-axis  rule: `if((x_axis=-1 and y_axis=-1),"y-axis",if((x_axis=-1 and y_axis=1),"x-axis and the y-axis","x-axis"))`
- h = 4  rule: `range(-4,4,1)`
- k = 4  rule: `range(-4,4,1)`

Inline slots:
- #1 variable-ref ref=h value=4 offset=124844
  context: tions in the graph shown are reflections of each other. Select the type of reflection(s). [[slot]]
- #2 variable-ref ref=ans value=y-axis offset=124892
  context: a reflection in the [[slot]]
- #3 variable-ref ref=dis1 value=x-axis and the y-axis offset=125008
  context: a reflection in the [[slot]]
- #4 variable-ref ref=dis2 value=x-axis offset=125056
  context: a reflection in the [[slot]]

## record-15 @ 133230

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | inverse of a radical function | range
- Counts: strings=116, variables=3, display=5, refs=31, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Given the function [[slot]], which of the following is a restriction on the inverse function, [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- k = – 4  rule: `range (-10,10,1)`
- h = 8  rule: `range(1,10,1)`
- b = 4  rule: `range(1,10,1)`

Inline slots:
- #1 variable-ref ref=b value=4 offset=134010
  context: Given the function [[slot]], which of the following is a restriction on the inverse function, [[slot]]?
- #2 variable-ref ref=k value=– 4 offset=134146
  context: n the function [[slot]], which of the following is a restriction on the inverse function, [[slot]]?
- #3 variable-ref ref=k value=– 4 offset=134156
  context: [[slot]]
- #4 variable-ref ref=h value=8 offset=134164
  context: [[slot]]
- #5 variable-ref ref=b value=4 offset=134174
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=134182
  context: [[slot]]

## record-16 @ 137576

- Metadata: Easy | Section 2.2 | RF13 | Square Root of a Function | domain | range
- Counts: strings=117, variables=8, display=5, refs=11, slots=6, visibleChoices=4

```text
Which point on the graph [[slot]] does not exist on the graph of [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- x1 = 3  rule: `range(-10,10,1)`
- x2 = 0.6  rule: `range(-1,1,.1)`
- x3 = –4  rule: `range(-10,10,1)`
- y_ans = –3  rule: `range(-10,-1,1)`
- x_ans = –8  rule: `range(-10,10,1)`
- y1 = 4  rule: `range(1,10,1)`
- y2 = 2.7  rule: `range(1,10,.1)`
- y3 = 4  rule: `range(1,10,1)`

Inline slots:
- #1 variable-ref ref=x1 value=3 offset=138696
  context: Which point on the graph [[slot]] does not exist on the graph of [[slot]]?
- #2 variable-ref ref=y1 value=4 offset=138762
  context: Which point on the graph [[slot]] does not exist on the graph of [[slot]]?
- #3 variable-ref ref=x_ans value=–8 offset=138772
  context: [[slot]]
- #4 variable-ref ref=y_ans value=–3 offset=138780
  context: [[slot]]
- #5 variable-ref ref=x3 value=–4 offset=138790
  context: [[slot]]
- #6 variable-ref ref=y3 value=4 offset=138798
  context: [[slot]]

## record-17 @ 141515

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | horizontal stretch | reflection
- Counts: strings=150, variables=6, display=5, refs=33, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which of the graphs shown below represents the base function [[slot]] (in black) and the stretched function g(x) =[[slot]] (in red)? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = –5  rule: `range(-9,9,1)`
- d = –6  rule: `range(-9,9,1)`
- b = 5/6  rule: `fracs(n,d)`
- dis1 = –0.833333333333  rule: `-n/d`
- dis2 = 1.2  rule: `d/n`
- dis3 = –1.2  rule: `-d/n`

Inline slots:
- #1 variable-ref ref=d value=–6 offset=142553
  context: Which of the graphs shown below represents the base function [[slot]] (in black) and the stretched function g(x) =[[slot]] (in red)?
- #2 variable-ref ref=d value=–6 offset=142645
  context: n below represents the base function [[slot]] (in black) and the stretched function g(x) =[[slot]] (in red)?
- #3 variable-ref ref=d value=–6 offset=142675
  context: [[slot]]
- #4 variable-ref ref=d value=–6 offset=142683
  context: [[slot]]
- #5 variable-ref ref=b value=5/6 offset=142693
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=142701
  context: [[slot]]

## record-18 @ 169517

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | invariant points
- Counts: strings=106, variables=8, display=5, refs=26, slots=6, visibleChoices=4

```text
What are the coordinates of the invariant point(s) when the function [[slot]] is reflected in the [[slot]]-axis? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- k = –3  rule: `range(-5,-1,1)`
- k2 = 9  rule: `k^2`
- axis = y  rule: `choose(which,"x","y")`
- y = ?  rule: `0`
- ans = (0, –3)  rule: `if(which=2,"(0, "+str(k)+")","("+str(k2)+", 0)")`
- dis1 = (–3, 0) and (9, 0)  rule: `if(which=2,"("+str(k)+", 0) and ("+str(k2)+", 0)","(0, "+str(k)+")")`
- dis2 = (0, 9)  rule: `"(0, "+str(k2)+")"`
- dis3 = (9, –3)  rule: `"("+str(k2)+", "+str(k)+")"`

Inline slots:
- #1 variable-ref ref=k value=–3 offset=170875
  context: What are the coordinates of the invariant point(s) when the function [[slot]] is reflected in the [[slot]]-axis?
- #2 variable-ref ref=k value=–3 offset=170919
  context: the coordinates of the invariant point(s) when the function [[slot]] is reflected in the [[slot]]-axis?
- #3 variable-ref ref=axis value=y offset=170939
  context: [[slot]]
- #4 variable-ref ref=dis3 value=(9, –3) offset=170947
  context: [[slot]]
- #5 variable-ref ref=ans value=(0, –3) offset=170957
  context: [[slot]]
- #6 variable-ref ref=dis1 value=(–3, 0) and (9, 0) offset=170965
  context: [[slot]]

## record-19 @ 173546

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph
- Counts: strings=128, variables=4, display=5, refs=18, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which is the graph of the square root of the function [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = – 5  rule: `range(-5,5,1)`
- k = – 2  rule: `range(-5,5,1)`
- h_dis = 5  rule: `-1*h`
- k_dis = 2  rule: `-1*k`

Inline slots:
- #1 variable-ref ref=h value=– 5 offset=174396
  context: Which is the graph of the square root of the function [[slot]]?
- #2 variable-ref ref=k value=– 2 offset=174406
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=174414
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=174424
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=174432
  context: [[slot]]

## record-20 @ 193648

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph
- Counts: strings=135, variables=5, display=5, refs=15, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the square root of the function shown in the graph?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = – 2  rule: `range(-5,5,1)`
- k = –3  rule: `range(-5,5,1)`
- h_dis = 2  rule: `-1*h`
- k_dis = 3  rule: `-1*k`
- b = 5  rule: `range(-5,5,1)`

Inline slots:
- #1 math-object ref=- value=- offset=194630
  context: Which graph represents the square root of the function shown in the graph? [[slot]]
- #2 unknown-object ref=- value=- offset=194638
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=194646
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=194656
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=194664
  context: [[slot]]

## record-21 @ 217790

- Metadata: Easy | Section 2.1 | Section 2.2 | RF13 | Radical Functions and Transformations | Square Root of a Function | inverse of a radical function
- Counts: strings=196, variables=2, display=7, refs=70, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which of the following functions is the correct inverse for the function [[slot]], {x | x 0, x R}? [[slot]] = [[slot]] [[slot]] [[slot]] = [[slot]] [[slot]] = [[slot]]
```

Choices:
- A. [[slot]] = [[slot]]
- B. [[slot]] = [[slot]]
- C. [[slot]]
- D. [[slot]] = [[slot]]

Variables:
- k = + 2  rule: `range(-9,9,1)`
- inv_k = – 2  rule: `-1*k`

Inline slots:
- #1 variable-ref ref=inv_k value=– 2 offset=218548
  context: Which of the following functions is the correct inverse for the function [[slot]], {x | x
- #2 variable-ref ref=k value=+ 2 offset=218598
  context: [[slot]] = [[slot]]
- #3 variable-ref ref=k value=+ 2 offset=218606
  context: [[slot]] = [[slot]]
- #4 variable-ref ref=k value=+ 2 offset=218614
  context: [[slot]]
- #5 variable-ref ref=inv_k value=– 2 offset=218624
  context: [[slot]] = [[slot]]
- #6 unknown-object ref=- value=- offset=218632
  context: [[slot]] = [[slot]]
- #7 unknown-object ref=- value=- offset=218640
  context: [[slot]] = [[slot]]
- #8 unknown-object ref=- value=- offset=218648
  context: [[slot]] = [[slot]]

## record-22 @ 224465

- Metadata: Easy | Section 2.2 | RF13 | Square Root of a Function | graph | square root of a function
- Counts: strings=127, variables=3, display=5, refs=16, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the square root of the graph shown?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- p = 4  rule: `range(-4,4,1)`
- q = –1  rule: `range(-4,4,1)`
- a = 1  rule: `range(-1,1,1)`

Inline slots:
- #1 diagram-object ref=- value=- offset=225187
  context: Which graph represents the square root of the graph shown? [[slot]]
- #2 unknown-object ref=- value=- offset=225195
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=225203
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=225213
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=225221
  context: [[slot]]

## record-23 @ 248347

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph | square root | of a function
- Counts: strings=122, variables=2, display=5, refs=15, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the square root of the graph shown? [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- k = –1  rule: `range(-4,4,1)`
- h = –4  rule: `range(-4,4,1)`

Inline slots:
- #1 diagram-object ref=- value=- offset=248935
  context: Which graph represents the square root of the graph shown? [[slot]]
- #2 unknown-object ref=- value=- offset=248943
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=248951
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=248961
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=248969
  context: [[slot]]

## record-24 @ 272095

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=137, variables=5, display=5, refs=20, slots=5, visibleChoices=4

```text
Which graph shows the graphical solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = + 8  rule: `range(-10,10,1)`
- k = – 3  rule: `range(-10,-2,1)`
- x_int = 1  rule: `pow(k,2)-h`
- x_dis1 = –1  rule: `-1*(pow(k,2)-h)`
- e = ?  rule: `V`

Inline slots:
- #1 variable-ref ref=h value=+ 8 offset=272961
  context: Which graph shows the graphical solution to the radical equation [[slot]]?
- #2 variable-ref ref=k value=– 3 offset=272971
  context: [[slot]]
- #3 variable-ref ref=x_dis1 value=–1 offset=272979
  context: [[slot]]
- #4 variable-ref ref=x_int value=1 offset=272989
  context: [[slot]]
- #5 variable-ref ref=x_int value=1 offset=272997
  context: [[slot]]

## record-25 @ 299211

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=148, variables=8, display=5, refs=22, slots=5, visibleChoices=4

```text
Which graph shows the graphical solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = – 5  rule: `range(-10,10,1)`
- k = – 2  rule: `range(-10,-2,1)`
- x_int = 6  rule: `((k^2)/(a^2*b))-h`
- x_dis1 = –6  rule: `-1*((k^2)/((a^2)*b)-h)`
- a = 2  rule: `range(1,5,1)`
- b = ?  rule: `range(1,5,1)`
- x_dis2 = –7  rule: `-1*((k^2)/((b^2)*a)-h)`
- e = ?  rule: `V`

Inline slots:
- #1 variable-ref ref=a value=2 offset=300437
  context: Which graph shows the graphical solution to the radical equation [[slot]]?
- #2 variable-ref ref=b value=range(1,5,1) offset=300447
  context: [[slot]]
- #3 variable-ref ref=h value=– 5 offset=300455
  context: [[slot]]
- #4 variable-ref ref=k value=– 2 offset=300465
  context: [[slot]]
- #5 variable-ref ref=x_int value=6 offset=300473
  context: [[slot]]

## record-26 @ 326699

- Metadata: Easy | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=164, variables=7, display=5, refs=27, slots=5, visibleChoices=4

```text
Which graph shows the solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = 4  rule: `range(2,10,1)`
- k = 8  rule: `range(2,10,1)`
- x_int2 = –4  rule: `-1*h`
- x_ans = –1  rule: `(-1*(2*h+1)+sqrt(((2*h+1)^2)-4*(h^2-k)))/2`
- y_ans = 3  rule: `x_ans+h`
- y_dis = 2.8  rule: `sqrt(k)`
- y_dis1 = 2.83  rule: `round(y_dis, 2)`

Inline slots:
- #1 variable-ref ref=h value=4 offset=327993
  context: Which graph shows the solution to the radical equation [[slot]]?
- #2 variable-ref ref=h value=4 offset=328003
  context: [[slot]]
- #3 variable-ref ref=k value=8 offset=328011
  context: [[slot]]
- #4 variable-ref ref=h value=4 offset=328021
  context: [[slot]]
- #5 variable-ref ref=h value=4 offset=328029
  context: [[slot]]

## record-27 @ 361609

- Metadata: Easy | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=126, variables=5, display=5, refs=26, slots=5, visibleChoices=4

```text
Which radical equation can be solved using the graph shown below?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = 2  rule: `range(2,10,1)`
- k = 4  rule: `range(2,10,1)`
- x_int2 = –2  rule: `-1*h`
- x_ans = 0  rule: `(-1*(2*h+1)+sqrt(((2*h+1)^2)-4*(h^2-k)))/2`
- y_ans = 2  rule: `x_ans+h`

Inline slots:
- #1 variable-ref ref=x_ans value=0 offset=362723
  context: Which radical equation can be solved using the graph shown below?[[slot]]
- #2 variable-ref ref=y_ans value=2 offset=362731
  context: [[slot]]
- #3 variable-ref ref=k value=4 offset=362739
  context: [[slot]]
- #4 variable-ref ref=h value=2 offset=362749
  context: [[slot]]
- #5 variable-ref ref=h value=2 offset=362757
  context: [[slot]]

## record-28 @ 373281

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=172, variables=10, display=5, refs=30, slots=5, visibleChoices=4

```text
Which graph shows the solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = – 5  rule: `range(-10,10,1)`
- k = 7  rule: `range(-10,10,1)`
- x_ans = –2  rule: `(-1*(-2*h+1)+sqrt(((-2*h+1)^2)-4*(h^2-k)))/2`
- y_ans = –3  rule: `-1*x_ans+h`
- x_dis1 = 9  rule: `round((-1*(2*h-1)+sqrt(((2*h-1)^2)-4*(h^2-k)))/2,1)`
- y_dis1 = 4.0  rule: `round(x_dis1+h,1)`
- x_dis2 = –2  rule: `round((-1*(1-2*h)+sqrt(((1-2*h)^2)-4*(h^2-k)))/2,1)`
- y_dis2 = 3  rule: `round(x_dis2-h,1)`
- x_dis3 = 6  rule: `round((-1*(2*h+1)+sqrt(((2*h+1)^2)-4*(h^2-k)))/2,1)`
- y_dis3 = –1  rule: `round(-1*x_dis3-h,1)`

Inline slots:
- #1 variable-ref ref=k value=7 offset=375089
  context: Which graph shows the solution to the radical equation [[slot]]?
- #2 variable-ref ref=h value=– 5 offset=375099
  context: [[slot]]
- #3 variable-ref ref=x_dis2 value=–2 offset=375107
  context: [[slot]]
- #4 variable-ref ref=y_dis2 value=3 offset=375117
  context: [[slot]]
- #5 variable-ref ref=x_dis1 value=9 offset=375125
  context: [[slot]]

## record-29 @ 408706

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=96, variables=6, display=5, refs=8, slots=5, visibleChoices=4

```text
What is the solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 4 6 9

Variables:
- h = + 9  rule: `range(-10,10,1)`
- k = – 3  rule: `range(-10,-2,1)`
- x_int = 0  rule: `k^2-h`
- x_dis1 = –18  rule: `-1*(pow(k,2)+h)`
- x_dis2 = 18  rule: `pow(k,2)+h`
- x_dis3 = 36  rule: `pow((k+h),2)`

Inline slots:
- #1 variable-ref ref=h value=+ 9 offset=409774
  context: What is the solution to the radical equation [[slot]]?
- #2 variable-ref ref=k value=– 3 offset=409784
  context: [[slot]]
- #3 variable-ref ref=x_dis2 value=18 offset=409792
  context: [[slot]]
- #4 variable-ref ref=x_dis1 value=–18 offset=409802
  context: [[slot]]
- #5 variable-ref ref=x_dis3 value=36 offset=409810
  context: [[slot]]

## record-30 @ 412184

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=107, variables=8, display=5, refs=10, slots=5, visibleChoices=4

```text
What is the solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 4 6 9

Variables:
- h = + 4  rule: `range(-10,10,1)`
- k = – 8  rule: `range(-10,-2,1)`
- x_int = 4  rule: `((k^2)/((a^2)*b))-h`
- x_dis1 = –4  rule: `-1*((k^2)/((a^2)*b))+h`
- x_dis2 = 12  rule: `((k^2)/((a^2)*b))+h`
- x_dis3 = 128  rule: `((k^2)/((a^2)/b))*h`
- a = 2  rule: `range(-10,10,1)`
- b = 2  rule: `range(-10,10,1)`

Inline slots:
- #1 variable-ref ref=a value=2 offset=413744
  context: What is the solution to the radical equation [[slot]]?
- #2 variable-ref ref=b value=2 offset=413754
  context: [[slot]]
- #3 variable-ref ref=h value=+ 4 offset=413762
  context: [[slot]]
- #4 variable-ref ref=k value=– 8 offset=413772
  context: [[slot]]
- #5 variable-ref ref=x_dis1 value=–4 offset=413780
  context: [[slot]]

## record-31 @ 416166

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=107, variables=9, display=5, refs=10, slots=5, visibleChoices=4

```text
What is the solution to the radical equation [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 4 6 9

Variables:
- h = + 7  rule: `range(-10,10,1)`
- k = –10  rule: `range(-10,-2,1)`
- x_int = –6  rule: `((k^2)/((a^2)*b))-h`
- x_dis1 = 6  rule: `-1*((k^2)/((a^2)*b))+h`
- x_dis2 = 8  rule: `((k^2)/((a^2)*b))+h`
- x_dis3 = 7  rule: `((k^2)/((a^2)/b))*h`
- a = –10  rule: `range(-10,10,1)`
- b = 1  rule: `range(-10,10,1)`
- n = ?  rule: `B`

Inline slots:
- #1 variable-ref ref=k value=–10 offset=417720
  context: What is the solution to the radical equation [[slot]]?
- #2 variable-ref ref=a value=–10 offset=417730
  context: [[slot]]
- #3 variable-ref ref=b value=1 offset=417738
  context: [[slot]]
- #4 variable-ref ref=h value=+ 7 offset=417748
  context: [[slot]]
- #5 variable-ref ref=x_dis1 value=6 offset=417756
  context: [[slot]]

## record-32 @ 420141

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution | extraneous roots
- Counts: strings=119, variables=6, display=5, refs=27, slots=9, visibleChoices=4

```text
When solving the equation [[slot]], which values must be checked for extraneous roots? [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]]
```

Choices:
- A. [[slot]] and [[slot]]
- B. [[slot]] and [[slot]]
- C. [[slot]] and [[slot]]
- D. [[slot]] and [[slot]]

Variables:
- h = + 8  rule: `range (-10,10,1)`
- k = + 6  rule: `range(-10,10,1)`
- x1 = –4  rule: `(-1*(2*k-1)+sqrt(((2*k-1)^2)-4*(k^2-h)))/2`
- x2 = –7  rule: `(-1*(2*k-1)-sqrt(((2*k-1)^2)-4*(k^2-h)))/2`
- x1_dis = 4  rule: `-x1`
- x2_dis1 = 7  rule: `-x2`

Inline slots:
- #1 variable-ref ref=h value=+ 8 offset=421453
  context: When solving the equation [[slot]], which values must be checked for extraneous roots?
- #2 variable-ref ref=h value=+ 8 offset=421565
  context: [[slot]] and [[slot]]
- #3 variable-ref ref=h value=+ 8 offset=421577
  context: [[slot]] and [[slot]]
- #4 variable-ref ref=h value=+ 8 offset=421585
  context: [[slot]] and [[slot]]
- #5 variable-ref ref=h value=+ 8 offset=421597
  context: [[slot]] and [[slot]]
- #6 variable-ref ref=k value=+ 6 offset=421607
  context: [[slot]] and [[slot]]
- #7 variable-ref ref=x1 value=–4 offset=421619
  context: [[slot]] and [[slot]]
- #8 variable-ref ref=x2_dis1 value=7 offset=421627
  context: [[slot]] and [[slot]]
- #9 variable-ref ref=x2_dis1 value=7 offset=421639
  context: [[slot]] and [[slot]]

## record-33 @ 424669

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | domain | range
- Counts: strings=104, variables=4, display=5, refs=22, slots=6, visibleChoices=4

```text
Which equation of a radical function would have the following domain and range?[[slot]]; [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- h = + 6  rule: `range(2,10,1)`
- k = + 10  rule: `range(2,10,1)`
- x_ans = –6  rule: `-1*h`
- y_dis = – 10  rule: `-1*k`

Inline slots:
- #1 variable-ref ref=x_ans value=–6 offset=425607
  context: Which equation of a radical function would have the following domain and range? [[slot]]; [[slot]]
- #2 variable-ref ref=y_dis value=– 10 offset=425613
  context: Which equation of a radical function would have the following domain and range? [[slot]]; [[slot]]
- #3 variable-ref ref=h value=+ 6 offset=425621
  context: [[slot]]
- #4 variable-ref ref=h value=+ 6 offset=425629
  context: [[slot]]
- #5 variable-ref ref=y_dis value=– 10 offset=425639
  context: [[slot]]
- #6 variable-ref ref=h value=+ 6 offset=425647
  context: [[slot]]

## record-34 @ 428643

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | translations | stretches
- Counts: strings=40, variables=0, display=6, refs=5, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("a ","b ","h ","k ") a, b, h, k list("vertical stretch","horizontal stretch","horizonal translation","vertical translation") vertical stretch, horizontal stretch, horizonal translation, vertical translation vertical translation The variable [[slot]] in the function [[slot]] represents a ________________.
```

Inline slots:
- #1 fixed-value ref=- value=- offset=429847
  context: The variable [[slot]] in the function [[slot]] represents a ________________.
- #2 fixed-value ref=- value=- offset=429883
  context: The variable [[slot]] in the function [[slot]] represents a ________________.

## record-35 @ 431722

- Metadata: Easy | Section 2.1 | RF13 | Radical Functions and Transformations | horizontal translation | vertical translation
- Counts: strings=87, variables=5, display=1, refs=25, slots=4, visibleChoices=0

```text
The graph of [[slot]][[slot]] is the graph of [[slot]] moved [[slot]] units to the ____________________.
```

Variables:
- h = + 8  rule: `range(-9,9,1)`
- h_display = 8  rule: `abs(h)`
- direction = left  rule: `if(function1=true,if(h<0,"right","left"),if(k<0,"down","up"))`
- function1 = 1  rule: `choose(rand(2),true,false)`
- function2 = 0  rule: `if(function1=true,false,true)`

Inline slots:
- #1 variable-ref ref=h value=+ 8 offset=432736
  context: The graph of [[slot]][[slot]] is the graph of [[slot]] moved [[slot]] units to the ____________________.
- #2 variable-ref ref=function1 value=1 offset=432738
  context: The graph of [[slot]][[slot]] is the graph of [[slot]] moved [[slot]] units to the ____________________.
- #3 variable-ref ref=function2 value=0 offset=432774
  context: The graph of [[slot]][[slot]] is the graph of [[slot]] moved [[slot]] units to the ____________________.
- #4 variable-ref ref=h_display value=8 offset=432790
  context: The graph of [[slot]][[slot]] is the graph of [[slot]] moved [[slot]] units to the ____________________.

## record-36 @ 435946

- Metadata: Difficult | Section 2.2 | RF13 | Radical Functions and Transformations | relative location
- Counts: strings=40, variables=0, display=7, refs=5, slots=2, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("f(x) < 0","f(x) = 0","0 < f(x) < 1","f(x) = 1","f(x) > 1") f(x) < 0, f(x) = 0, 0 < f(x) < 1, f(x) = 1, f(x) > 1 f(x) > 1 list("is undefined","intersects f(x) on the x-axis","is above the graph of y = f(x)","intersects the graph of y = f(x)","is below the graph of y = f(x)") is undefined, intersects f(x) on the x-axis, is above the graph of y = f(x), intersects the graph of y = f(x), is below the graph of y = f(x) is below the graph of y = f(x) If the value of f(x) satisfies [[slot]], then the graph of [[slot]] ________________.
```

Choices:
- G. If the value of f(x) satisfies [[slot]], then the graph of [[slot]] ________________.

Inline slots:
- #1 diagram-object ref=- value=- offset=437612
  context: If the value of f(x) satisfies [[slot]], then the graph of [[slot]] ________________.
- #2 diagram-object ref=- value=- offset=437654
  context: If the value of f(x) satisfies [[slot]], then the graph of [[slot]] ________________.

## record-37 @ 439483

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | range | square root
- Counts: strings=38, variables=1, display=6, refs=7, slots=2, visibleChoices=1
- Suspicious: slot-without-variable-ref

```text
range (2,10,1) + 6 a<>b 3/2 -1*a If [[slot]], the range of [[slot]] is ____________________.
```

Choices:
- A. ans fracs(a_ans,b) 3/2 a_ans -1*a 9

Variables:
- a = –9  rule: `range(-10,-2,1)`

Inline slots:
- #1 variable-ref ref=a value=–9 offset=440069
  context: If [[slot]], the range of [[slot]] is ____________________.
- #2 unknown-object ref=- value=- offset=440101
  context: If [[slot]], the range of [[slot]] is ____________________.

## record-38 @ 442097

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=46, variables=6, display=1, refs=9, slots=1, visibleChoices=0

```text
When solving the equation [[slot]] algebraically, the restriction on the variable is ____________________.
```

Variables:
- h = + 6  rule: `range(1,12,1)`
- k = – 6  rule: `range(-9,9,1)`
- a = –10  rule: `range(-10,10,1)`
- b = –3  rule: `range(-12,-1,1)`
- range_num = –6  rule: `-1*h`
- ans = 2  rule: `fracs(range_num,b)`

Inline slots:
- #1 variable-ref ref=a value=–10 offset=443163
  context: When solving the equation [[slot]] algebraically, the restriction on the variable is ____________________.

## record-39 @ 445040

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=39, variables=5, display=1, refs=6, slots=1, visibleChoices=0

```text
The solution to the equation [[slot]] is ____________________.
```

Variables:
- h = + 19  rule: `range(1,20,1)`
- k = –4  rule: `range(-10,10,1)`
- a = + 2  rule: `range(-10,10,1)`
- ans_x = –15  rule: `((k^2)/(a^2))-h`
- n = ?  rule: `7`

Inline slots:
- #1 variable-ref ref=k value=–4 offset=445910
  context: The solution to the equation [[slot]] is ____________________.

## record-40 @ 447539

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | translations | vertical translation | horizontal translation
- Counts: strings=21, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=447903
  context: [[slot]]

## record-41 @ 453053

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | translations | vertical translation | horizontal translation
- Counts: strings=21, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=453417
  context: [[slot]]

## record-42 @ 458567

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | translations | vertical translation | horizontal translation
- Counts: strings=21, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=458931
  context: [[slot]]

## record-43 @ 464081

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | translations | vertical translation | horizontal translation
- Counts: strings=21, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=464445
  context: [[slot]]

## record-44 @ 469595

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | translations | vertical translation | horizontal translation
- Counts: strings=21, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=469959
  context: [[slot]]

## record-45 @ 475109

- Metadata: Average | Section 2.1 | RF13 | RF13 | Radical Functions and Transformations | translations | vertical translation | horizontal translation
- Counts: strings=158, variables=0, display=1, refs=55, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Create a graph of [[slot]] for each base function given, using transformations.a) [[slot]]b) [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=475471
  context: Create a graph of [[slot]] for each base function given, using transformations. a) [[slot]] b) [[slot]]
- #2 math-object ref=- value=- offset=475587
  context: Create a graph of [[slot]] for each base function given, using transformations. a) [[slot]] b) [[slot]]
- #3 math-object ref=- value=- offset=475597
  context: e a graph of [[slot]] for each base function given, using transformations. a) [[slot]] b) [[slot]]

## record-46 @ 493310

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | transformations
- Counts: strings=118, variables=0, display=1, refs=39, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the equation of each radical function, which has been transformed from [[slot]] by the given translations.a) vertical stretch by a factor of 5, then a horizontal translation of 6 units rightb) horizontal stretch by a factor of [[slot]], then a vertical translation of 4 units downc) horizontal reflection in the y-axis, then a vertical translation of 9 units up and horizontal translation of 2 units rightd) horizontal stretch by a factor of [[slot]], vertical reflection in the x-axis, and vertical stretch by a factor of [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=493694
  context: Determine the equation of each radical function, which has been transformed from [[slot]] by the given translations. a) vertical stretch by a factor of 5, then a horizontal transl
- #2 unknown-object ref=- value=- offset=493996
  context: of 5, then a horizontal translation of 6 units right b) horizontal stretch by a factor of [[slot]], then a vertical translation of 4 units down c) horizontal reflection in the y-axis, then
- #3 unknown-object ref=- value=- offset=494416
  context: units up and horizontal translation of 2 units right d) horizontal stretch by a factor of [[slot]], vertical reflection in the x-axis, and vertical stretch by a factor of [[slot]]
- #4 unknown-object ref=- value=- offset=494564
  context: actor of [[slot]], vertical reflection in the x-axis, and vertical stretch by a factor of [[slot]]

## record-47 @ 500059

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations
- Counts: strings=74, variables=0, display=1, refs=16, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
For each graph, write the equation of a radical function of the form [[slot]].a) [[slot]]b) [[slot]]c) [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=500435
  context: For each graph, write the equation of a radical function of the form [[slot]]. a) [[slot]] b) [[slot]] c) [[slot]]
- #2 math-object ref=- value=- offset=500447
  context: For each graph, write the equation of a radical function of the form [[slot]]. a) [[slot]] b) [[slot]] c) [[slot]]
- #3 math-object ref=- value=- offset=500457
  context: each graph, write the equation of a radical function of the form [[slot]]. a) [[slot]] b) [[slot]] c) [[slot]]
- #4 math-object ref=- value=- offset=500467
  context: write the equation of a radical function of the form [[slot]]. a) [[slot]] b) [[slot]] c) [[slot]]

## record-48 @ 515782

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | domain | range
- Counts: strings=41, variables=0, display=1, refs=4, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the domain and range of each function.a) [[slot]]b) [[slot]]c) [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=516106
  context: Determine the domain and range of each function. a) [[slot]] b) [[slot]] c) [[slot]]
- #2 math-object ref=- value=- offset=516116
  context: Determine the domain and range of each function. a) [[slot]] b) [[slot]] c) [[slot]]
- #3 math-object ref=- value=- offset=516126
  context: Determine the domain and range of each function. a) [[slot]] b) [[slot]] c) [[slot]]

## record-49 @ 519435

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph | domain | range | square root of a function
- Counts: strings=190, variables=0, display=1, refs=55, slots=5, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Sketch the graph of each function [[slot]], and then sketch the graph of [[slot]].i) [[slot]]ii) [[slot]]iii) [[slot]]b) State the domain and range of each f(x) and g(x).
```

Inline slots:
- #1 math-object ref=- value=- offset=519777
  context: a) Sketch the graph of each function [[slot]], and then sketch the graph of [[slot]]. i) [[slot]] ii) [[slot]] iii) [[slot]] b) State t
- #2 math-object ref=- value=- offset=519841
  context: a) Sketch the graph of each function [[slot]], and then sketch the graph of [[slot]]. i) [[slot]] ii) [[slot]] iii) [[slot]] b) State the domain and range of each f(x) and g(
- #3 math-object ref=- value=- offset=519853
  context: a) Sketch the graph of each function [[slot]], and then sketch the graph of [[slot]]. i) [[slot]] ii) [[slot]] iii) [[slot]] b) State the domain and range of each f(x) and g(x).
- #4 math-object ref=- value=- offset=519865
  context: e graph of each function [[slot]], and then sketch the graph of [[slot]]. i) [[slot]] ii) [[slot]] iii) [[slot]] b) State the domain and range of each f(x) and g(x).
- #5 math-object ref=- value=- offset=519879
  context: h function [[slot]], and then sketch the graph of [[slot]]. i) [[slot]] ii) [[slot]] iii) [[slot]] b) State the domain and range of each f(x) and g(x).

## record-50 @ 546028

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph | square root of a function
- Counts: strings=129, variables=4, display=1, refs=16, slots=5, visibleChoices=0

```text
The graph of [[slot]] is shown in black, and the graph of [[slot]] is shown in blue.a) [[slot]]b) [[slot]]c) [[slot]]
```

Variables:
- r = <  rule: `<`
- _ = 0  rule: `)`
- y = ?  rule: `-inf`
- inf = 0  rule: `x+3`

Inline slots:
- #1 variable-ref ref=r value=< offset=560247
  context: The graph of [[slot]] is shown in black, and the graph of [[slot]] is shown in blue. a) [[slot]] b) [[slot]] c)
- #2 variable-ref ref=_ value=0 offset=560323
  context: The graph of [[slot]] is shown in black, and the graph of [[slot]] is shown in blue. a) [[slot]] b) [[slot]] c) [[slot]]
- #3 variable-ref ref=_ value=0 offset=560369
  context: The graph of [[slot]] is shown in black, and the graph of [[slot]] is shown in blue. a) [[slot]] b) [[slot]] c) [[slot]]
- #4 variable-ref ref=y value=-inf offset=560379
  context: of [[slot]] is shown in black, and the graph of [[slot]] is shown in blue. a) [[slot]] b) [[slot]] c) [[slot]]
- #5 variable-ref ref=inf value=0 offset=560389
  context: is shown in black, and the graph of [[slot]] is shown in blue. a) [[slot]] b) [[slot]] c) [[slot]]

## record-51 @ 580094

- Metadata: Difficult | Section 2.2 | RF13 | Square Root of a Function | graph | square root of a function
- Counts: strings=41, variables=0, display=1, refs=10, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of [[slot]] and use it to sketch the graph of [[slot]].
```

Inline slots:
- #1 diagram-object ref=- value=- offset=580372
  context: Sketch the graph of [[slot]] and use it to sketch the graph of [[slot]].
- #2 diagram-object ref=- value=- offset=580444
  context: Sketch the graph of [[slot]] and use it to sketch the graph of [[slot]].

## record-52 @ 588688

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=26, variables=0, display=1, refs=2, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve the equation [[slot]], [[slot]], algebraically.
```

Inline slots:
- #1 math-object ref=- value=- offset=588954
  context: Solve the equation [[slot]], [[slot]], algebraically.
- #2 math-object ref=- value=- offset=588960
  context: Solve the equation [[slot]], [[slot]], algebraically.

## record-53 @ 590989

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=34, variables=0, display=1, refs=4, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve the equation [[slot]] graphically.
```

Inline slots:
- #1 math-object ref=- value=- offset=591255
  context: Solve the equation [[slot]] graphically.

## record-54 @ 600595

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=31, variables=0, display=1, refs=2, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Jim states that the equations [[slot]] and [[slot]] have the same solution. Is he correct? Justify your reasoning.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=600887
  context: Jim states that the equations [[slot]] and [[slot]] have the same solution. Is he correct? Justify your reasoning.
- #2 unknown-object ref=- value=- offset=600899
  context: Jim states that the equations [[slot]] and [[slot]] have the same solution. Is he correct? Justify your reasoning.

## record-55 @ 603681

- Metadata: Average | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=42, variables=0, display=2, refs=12, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A student designs a special container as part of an egg drop experiment. She believes that the container can withstand a fall as long as the speed of the container does not exceed 80 ft/s. She uses the equation [[slot]] to model the velocity, v, in feet per second, as a function of constant acceleration, a, in feet per second squared and the drop distance, d, in feet. Assuming the student s specifications are correct, will the egg break if the student drops the egg from shoulder height (5 ft) off a building 80 ft high? What is the maximum height the egg can be dropped from? (Note: The acceleration due to gravity is 32 ft/s2.)
```

Inline slots:
- #1 math-object ref=- value=- offset=604331
  context: fall as long as the speed of the container does not exceed 80 ft/s. She uses the equation [[slot]] to model the velocity, v, in feet per second, as a function of constant acceleration, a,

## record-56 @ 608458

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | graphical solution
- Counts: strings=33, variables=0, display=1, refs=4, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve the equation [[slot]] graphically.
```

Inline slots:
- #1 math-object ref=- value=- offset=608728
  context: Solve the equation [[slot]] graphically.

## record-57 @ 618102

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=22, variables=0, display=1, refs=0, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-post-font-refs, slots-but-no-algorithmic-variables

```text
Solve the equation [[slot]] algebraically.
```

Inline slots:
- #1 math-object ref=- value=- offset=618372
  context: Solve the equation [[slot]] algebraically.

## record-58 @ 620176

- Metadata: Average | Section 2.1 | Section 2.3 | RF13 | Radical Functions and Transformations | Solving Radical Equations Graphically | x-intercepts | domain | range
- Counts: strings=103, variables=7, display=4, refs=12, slots=4, visibleChoices=0

```text
The speed, s, in metres per second, of sound in dry air is can be described by the function [[slot]], where T is temperature, in degrees Celsius.a) Determine the domain and range of the function.b) Determine the speed of sound, to the nearest tenth of a metre per second, for each of the following temperatures.i) [[slot]] Cii) [[slot]] Ciii) [[slot]] Cc) Graph the function and determine the x-intercept using the graph.d) What is the meaning of the x-intercept in this context?
```

Variables:
- i = 20  rule: `range(-20,20,5)`
- T1 = –8  rule: `range(-40,40,1)`
- T2 = 12  rule: `T1+i`
- T3 = 32  rule: `T1+2*i`
- a1 = 326.4  rule: `331.3*sqrt(1+T1/273.15)`
- a2 = 338.5  rule: `331.3*sqrt(1+T2/273.15)`
- a3 = 350.2  rule: `331.3*sqrt(1+T3/273.15)`

Inline slots:
- #1 variable-ref ref=T1 value=–8 offset=621330
  context: e speed, s, in metres per second, of sound in dry air is can be described by the function [[slot]], where T is temperature, in degrees Celsius. a) Determine the domain and range of the fun
- #2 variable-ref ref=T2 value=12 offset=621766
  context: d, to the nearest tenth of a metre per second, for each of the following temperatures. i) [[slot]]
- #3 variable-ref ref=T3 value=32 offset=621782
  context: C ii) [[slot]]
- #4 variable-ref ref=T1 value=–8 offset=621800
  context: C iii) [[slot]]

## record-59 @ 633273

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | translations | graph | domain | range
- Counts: strings=88, variables=0, display=1, refs=21, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The manufacturer of a new Global Positioning Satellite (GPS) system wants to predict the consumer interest in its new device. The company uses the function [[slot]] to model the number, I, in thousands, of pre-orders for the GPS as a function of the number, w, of weeks before the GPS release date.a) What are the domain and range and what do they mean in this situation?b) Identify the transformations represented by the function compared to [[slot]].c) Graph the function and explain what the shape of the graph indicates about the situation.d) Determine the number of pre-orders the manufacturer can expect to have 10 weeks before the release date.
```

Inline slots:
- #1 math-object ref=- value=- offset=633855
  context: m wants to predict the consumer interest in its new device. The company uses the function [[slot]] to model the number, I, in thousands, of pre-orders for the GPS as a function of the numb
- #2 math-object ref=- value=- offset=634419
  context: n this situation? b) Identify the transformations represented by the function compared to [[slot]]. c) Graph the function and explain what the shape of the graph indicates about the situat

## record-60 @ 646052

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | graph | square root of a function | domain | range
- Counts: strings=152, variables=0, display=1, refs=40, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]].a) Determine the square root of the function.b) Graph the functions on the same set of axes.c) State the domains and ranges of the graphs.d) Describe the relationship between the domain and range of f(x) and the domain and range of g(x).
```

Choices:
- G. w

Inline slots:
- #1 math-object ref=- value=- offset=646392
  context: Consider the function [[slot]]. a) Determine the square root of the function. b) Graph the functions on the same set of

## record-61 @ 663225

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations | domain | range
- Counts: strings=85, variables=0, display=1, refs=13, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
For [[slot]]and [[slot]], do the following.a) Graph f(x) and g(x) on the same set of axes.b) Determine the domain and range of each function.c) Explain which transformations would need to be applied to the graph of f(x) to obtain the graph of g(x).
```

Inline slots:
- #1 diagram-object ref=- value=- offset=663509
  context: For [[slot]]and [[slot]], do the following. a) Graph f(x) and g(x) on the same set of axes. b) Determi
- #2 diagram-object ref=- value=- offset=663519
  context: For [[slot]]and [[slot]], do the following. a) Graph f(x) and g(x) on the same set of axes. b) Determine the domai

## record-62 @ 678340

- Metadata: Difficult | Section 2.1 | RF13 | Radical Functions and Transformations | graph | transformations
- Counts: strings=55, variables=0, display=1, refs=9, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Two groups of students are conducting a lab to determine the relationship between the period, p, in seconds, of a pendulum and the length, l, in metres, of the string. The curves of best fit from the experiment are shown on the graph.[[slot]]a) When asked the type of function that could be used to model their findings, both groups argue that a radical function can be used. Do you agree with each group?b) How do these graphs differ from the graph of [[slot]]?c) Write a function to approximate the graph for each group.d) What may have caused the differences in the data between the two groups? Justify your answer in terms of transformations.
```

Inline slots:
- #1 math-object ref=- value=- offset=679052
  context: metres, of the string. The curves of best fit from the experiment are shown on the graph. [[slot]] a) When asked the type of function that could be used to model their findings, both group
- #2 math-object ref=- value=- offset=679480
  context: an be used. Do you agree with each group? b) How do these graphs differ from the graph of [[slot]]? c) Write a function to approximate the graph for each group. d) What may have caused the

## record-63 @ 692947

- Metadata: Average | Section 2.1 | RF13 | Radical Functions and Transformations | graph | horizontal stretch
- Counts: strings=89, variables=0, display=1, refs=19, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The kinetic energy (energy of motion), E, in joules, of an object is given by the equation [[slot]], where m represents the mass of the object, in kilograms, and v represents its speed, in metres per second.a) Determine the general equation for the velocity of a mass as a function of its kinetic energy.b) Find the speed of an object of mass 12 kg moving with a kinetic energy ofi) 200 Jii) 420 Jc) Graph the function if the mass is 12 kg.d) John conducts an experiment and graphs the data, resulting in the graph below. What is the mass of the object?[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=693373
  context: he kinetic energy (energy of motion), E, in joules, of an object is given by the equation [[slot]], where m represents the mass of the object, in kilograms, and v represents its speed, in
- #2 diagram-object ref=- value=- offset=694297
  context: riment and graphs the data, resulting in the graph below. What is the mass of the object? [[slot]]

## record-64 @ 708245

- Metadata: Average | Section 2.2 | RF13 | Square Root of a Function | graph | domain | range | square root of a function
- Counts: strings=53, variables=0, display=1, refs=7, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Graph the functions below, and then identify and compare their domains and ranges.[[slot]] and [[slot]]
```

Inline slots:
- #1 diagram-object ref=- value=- offset=708679
  context: Graph the functions below, and then identify and compare their domains and ranges. [[slot]] and [[slot]]
- #2 unknown-object ref=- value=- offset=708691
  context: the functions below, and then identify and compare their domains and ranges. [[slot]] and [[slot]]

## record-65 @ 718808

- Metadata: Difficult | Section 2.3 | RF13 | Solving Radical Equations Graphically | algebraic solution
- Counts: strings=178, variables=0, display=1, refs=57, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sun-Eui, a graduate student, is using the function [[slot]] to model the number of flowers a new hybrid bee can pollinate. For the function, N represents the number, in thousands, of flowers pollinated and t represents the time, in days.a) If there are 10 000 flowers, how long will it take to pollinate all of the flowers?b) Sun-Eui believes that the second generation of bees can reduce the time to pollinate the flowers by half by changing the function to [[slot]]. Is she correct? Justify your reasoning.c) Should Sun-Eui continue with the project?
```

Inline slots:
- #1 math-object ref=- value=- offset=719142
  context: Sun-Eui, a graduate student, is using the function [[slot]] to model the number of flowers a new hybrid bee can pollinate. For the function, N repres
- #2 math-object ref=- value=- offset=719948
  context: of bees can reduce the time to pollinate the flowers by half by changing the function to [[slot]]. Is she correct? Justify your reasoning. c) Should Sun-Eui continue with the project?

