# Record Inspection: Chapter 09.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 09.bnk`
- Inflated bytes: 610300
- Records: 55
- Inline slots: 188
- Slot classes: variable-ref=133, unknown-object=34, math-object=21

## record-1 @ 4628

- Metadata: Easy | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | vertical asymptote
- Counts: strings=147, variables=2, display=9, refs=38, slots=5, visibleChoices=4

```text
Which of the reciprocal functions has a vertical asymptote with equation [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 9  rule: `range(1,9)`
- denom = 2  rule: `range(1,9)`

Inline slots:
- #1 variable-ref ref=num value=9 offset=5448
  context: Which of the reciprocal functions has a vertical asymptote with equation [[slot]]?
- #2 variable-ref ref=denom value=2 offset=5460
  context: [[slot]]
- #3 variable-ref ref=denom value=2 offset=5470
  context: [[slot]]
- #4 variable-ref ref=num value=9 offset=5482
  context: [[slot]]
- #5 variable-ref ref=num value=9 offset=5492
  context: [[slot]]

## record-2 @ 9919

- Metadata: Average | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | behaviour at non-permissible values
- Counts: strings=187, variables=5, display=9, refs=39, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is true about the behaviour of the function [[slot]] as [[slot]] [[slot]][[slot]] (right to left)? A. [[slot]][[slot]] C. [[slot]] B. [[slot]][[slot]] D. f(x) is undefined
```

Choices:
- A. [[slot]][[slot]]
- B. [[slot]][[slot]]
- C. [[slot]]
- D. f(x) is undefined 9

Variables:
- num = + 5  rule: `range(-9,9)`
- denom = 4  rule: `range(-9,9)`
- np_value = -5/4  rule: `fracs(-num,denom)`
- ans = ?  rule: `if(denom>0,chr(43),chr(45))`
- dis1 = ?  rule: `if(denom<0,chr(43),chr(45))`

Inline slots:
- #1 variable-ref ref=denom value=4 offset=11035
  context: What is true about the behaviour of the function [[slot]] as [[slot]] [[slot]][[slot]] (right to left)?
- #2 variable-ref ref=num value=+ 5 offset=11045
  context: What is true about the behaviour of the function [[slot]] as [[slot]] [[slot]][[slot]] (right to left)?
- #3 variable-ref ref=np_value value=-5/4 offset=11049
  context: What is true about the behaviour of the function [[slot]] as [[slot]] [[slot]][[slot]] (right to left)?
- #4 variable-ref ref=dis1 value=if(denom<0,chr(43),chr(45)) offset=11051
  context: What is true about the behaviour of the function [[slot]] as [[slot]] [[slot]][[slot]] (right to left)?
- #5 variable-ref ref=ans value=if(denom>0,chr(43),chr(45)) offset=11095
  context: [[slot]][[slot]]
- #6 unknown-object ref=- value=- offset=11097
  context: [[slot]][[slot]]
- #7 unknown-object ref=- value=- offset=11109
  context: [[slot]]
- #8 unknown-object ref=- value=- offset=11121
  context: [[slot]][[slot]]
- #9 unknown-object ref=- value=- offset=11123
  context: [[slot]][[slot]]

## record-3 @ 16570

- Metadata: Easy | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | x-intercept
- Counts: strings=87, variables=4, display=8, refs=9, slots=3, visibleChoices=4

```text
What is the x-intercept of [[slot]]? A. There is no x-intercept. C. [[slot]] B. [[slot]] D.
```

Choices:
- A. There is no x-intercept.
- B. [[slot]]
- C. [[slot]]
- D. 0

Variables:
- num = + 4  rule: `range(-9,9)`
- denom = 2  rule: `range(-9,9)`
- dis1 = -2  rule: `fracs(-num,denom)`
- dis2 = -1/2  rule: `fracs(-denom,num)`

Inline slots:
- #1 variable-ref ref=denom value=2 offset=17450
  context: What is the x-intercept of [[slot]]?
- #2 variable-ref ref=num value=+ 4 offset=17518
  context: [[slot]]
- #3 variable-ref ref=dis1 value=-2 offset=17530
  context: [[slot]]

## record-4 @ 20004

- Metadata: Average | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | graph from function
- Counts: strings=132, variables=3, display=9, refs=20, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –4  rule: `range(-9,9)`
- h = – 9  rule: `range(-9,9)`
- k = – 5  rule: `range(-9,9)`

Inline slots:
- #1 variable-ref ref=a value=–4 offset=20808
  context: Which graph represents the function [[slot]]?
- #2 variable-ref ref=h value=– 9 offset=20820
  context: [[slot]]
- #3 variable-ref ref=k value=– 5 offset=20830
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=20842
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=20852
  context: [[slot]]

## record-5 @ 40400

- Metadata: Difficult | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | graph from function
- Counts: strings=131, variables=3, display=9, refs=20, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The rational function [[slot]] is represented by which graph? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 7

Variables:
- a = –3  rule: `range(-9,9)`
- h = – 5  rule: `range(-9,9)`
- k = – 7  rule: `range(-9,9)`

Inline slots:
- #1 variable-ref ref=a value=–3 offset=41198
  context: The rational function [[slot]] is represented by which graph?
- #2 variable-ref ref=k value=– 7 offset=41270
  context: [[slot]]
- #3 variable-ref ref=h value=– 5 offset=41280
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=41292
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=41302
  context: [[slot]]

## record-6 @ 60742

- Metadata: Average | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | function from graph
- Counts: strings=320, variables=4, display=9, refs=86, slots=5, visibleChoices=4

```text
Which function represents the graph shown below?[[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 9  rule: `range(-9,9)`
- h = – 8  rule: `range(-9,9)`
- k = + 3  rule: `range(-9,9)`
- a_dis = –9  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=a value=9 offset=61656
  context: Which function represents the graph shown below? [[slot]]
- #2 variable-ref ref=h value=– 8 offset=61666
  context: [[slot]]
- #3 variable-ref ref=k value=+ 3 offset=61676
  context: [[slot]]
- #4 variable-ref ref=a_dis value=–9 offset=61688
  context: [[slot]]
- #5 variable-ref ref=k value=+ 3 offset=61698
  context: [[slot]]

## record-7 @ 79863

- Metadata: Difficult | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function
- Counts: strings=118, variables=9, display=9, refs=22, slots=6, visibleChoices=4

```text
What is the value of k in the function [[slot]] if its graph passes through the point ([[slot]], [[slot]])? A. [[slot]] C. [[slot]] B. [[slot]] D. No such k exists
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. No such k exists

Variables:
- b = 5  rule: `range(2,5)`
- d = 2  rule: `range(1,9)`
- a = –2  rule: `d-k`
- x_var = 3  rule: `range(1,9)`
- y_var = -2/19  rule: `fracs(a,e)`
- k = 4  rule: `range(1,10)`
- e = 19  rule: `b*x_var+k`
- dis1 = -19/2  rule: `fracs(e,a)`
- dis2 = –10  rule: `a*b`

Inline slots:
- #1 variable-ref ref=b value=5 offset=80955
  context: What is the value of k in the function [[slot]] if its graph passes through the point ([[slot]], [[slot]]) ?
- #2 variable-ref ref=k value=4 offset=81037
  context: What is the value of k in the function [[slot]] if its graph passes through the point ([[slot]], [[slot]]) ?
- #3 variable-ref ref=k value=4 offset=81043
  context: the value of k in the function [[slot]] if its graph passes through the point ([[slot]], [[slot]]) ?
- #4 variable-ref ref=d value=2 offset=81059
  context: [[slot]]
- #5 variable-ref ref=k value=4 offset=81069
  context: [[slot]]
- #6 variable-ref ref=b value=5 offset=81081
  context: [[slot]]

## record-8 @ 84248

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function | vertical asymptote
- Counts: strings=202, variables=10, display=9, refs=46, slots=7, visibleChoices=4

```text
Which function has vertical asymptotes with equations [[slot]] and [[slot]] [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 7  rule: `range(2,9)`
- b = + 6  rule: `range(-9,9)`
- c = + 9  rule: `range(-9,9)`
- d = + 2  rule: `range(-9,9)`
- e = + 69  rule: `a*c+b`
- f = + 54  rule: `b*c`
- asymp1 = –9  rule: `-1*c`
- asymp2 = -6/7  rule: `fracs(-b,a)`
- e_dis = – 69  rule: `-1*e`
- e_dis2 = + 15  rule: `b+c`

Inline slots:
- #1 variable-ref ref=asymp1 value=–9 offset=85600
  context: Which function has vertical asymptotes with equations [[slot]] and [[slot]] [[slot]]?
- #2 variable-ref ref=d value=+ 2 offset=85612
  context: Which function has vertical asymptotes with equations [[slot]] and [[slot]] [[slot]]?
- #3 variable-ref ref=d value=+ 2 offset=85616
  context: Which function has vertical asymptotes with equations [[slot]] and [[slot]] [[slot]]?
- #4 variable-ref ref=d value=+ 2 offset=85628
  context: [[slot]]
- #5 variable-ref ref=d value=+ 2 offset=85638
  context: [[slot]]
- #6 variable-ref ref=d value=+ 2 offset=85650
  context: [[slot]]
- #7 variable-ref ref=d value=+ 2 offset=85660
  context: [[slot]]

## record-9 @ 90795

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function | vertical asymptote
- Counts: strings=180, variables=9, display=9, refs=40, slots=5, visibleChoices=4

```text
Which function has a point of discontinuity at [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 2 5 7

Variables:
- a = 2  rule: `range(2,9)`
- b = + 4  rule: `range(-9,9)`
- c = – 3  rule: `range(-9,9)`
- d = + 7  rule: `range(-9,9)`
- e = – 2  rule: `a*c+b`
- f = – 12  rule: `b*c`
- asymp1 = + 3  rule: `-1*c`
- e_dis = – 6  rule: `2*c`
- f_dis = + 9  rule: `c^2`

Inline slots:
- #1 variable-ref ref=d value=+ 7 offset=92075
  context: Which function has a point of discontinuity at [[slot]]?
- #2 variable-ref ref=d value=+ 7 offset=92087
  context: [[slot]]
- #3 variable-ref ref=d value=+ 7 offset=92097
  context: [[slot]]
- #4 variable-ref ref=d value=+ 7 offset=92109
  context: [[slot]]
- #5 variable-ref ref=c value=– 3 offset=92119
  context: [[slot]]

## record-10 @ 96605

- Metadata: Difficult | Section 9.2 | RF14 | Analysing Rational Functions | rational function | discontinuity | hole
- Counts: strings=166, variables=13, display=9, refs=30, slots=5, visibleChoices=4

```text
Which graph represents [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0

Variables:
- a = 5  rule: `range(2,5)`
- b = – 8  rule: `range(-9,9)`
- c = – 3  rule: `range(-5,5)`
- d = + 9  rule: `range(-9,9)`
- e = – 23  rule: `a*c+b`
- f = + 24  rule: `b*c`
- hole = + 3  rule: `-1*c`
- e_dis = – 6  rule: `2*c`
- f_dis = + 9  rule: `c^2`
- y_var3 = 0.033333333333  rule: `(hole)/(a*hole^2-e*hole-f)`
- e_dis1 = + 23  rule: `-1*e`
- y_var2 = 0.142857142857  rule: `1/(hole*a+b)`
- g = ?  rule: `0`

Inline slots:
- #1 variable-ref ref=c value=– 3 offset=98165
  context: Which graph represents [[slot]]?
- #2 variable-ref ref=a value=5 offset=98177
  context: [[slot]]
- #3 variable-ref ref=e value=– 23 offset=98187
  context: [[slot]]
- #4 variable-ref ref=f value=+ 24 offset=98199
  context: [[slot]]
- #5 variable-ref ref=d value=+ 9 offset=98209
  context: [[slot]]

## record-11 @ 124984

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function | y-intercept
- Counts: strings=144, variables=9, display=5, refs=27, slots=4, visibleChoices=5

```text
Which function has a y-intercept of [[slot]]? [[slot]] [[slot]] [[slot]] all of the above
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. all of the above
- H. 0 2 4 6

Variables:
- x1 = + 3  rule: `range(-9,9)`
- x2 = + 9  rule: `range(-9,9)`
- b = + 12  rule: `x1+x2`
- c = + 27  rule: `x1*x2`
- d = –8  rule: `range(-9,9)`
- y_int = -8/27  rule: `fracs(d,(x1*x2))`
- b_dis = – 12  rule: `-1*b`
- c_dis = – 27  rule: `-1*c`
- d_dis = 8  rule: `-1*d`

Inline slots:
- #1 variable-ref ref=y_int value=-8/27 offset=126252
  context: Which function has a y-intercept of [[slot]]?
- #2 variable-ref ref=d value=–8 offset=126262
  context: [[slot]]
- #3 variable-ref ref=b_dis value=– 12 offset=126270
  context: [[slot]]
- #4 variable-ref ref=c_dis value=– 27 offset=126280
  context: [[slot]]

## record-12 @ 130018

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | linear expressions in numerator and denominator | horizontal asymptote
- Counts: strings=170, variables=6, display=9, refs=43, slots=6, visibleChoices=4

```text
Which function has a horizontal asymptote with equation [[slot]] [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 2  rule: `range(2,9)`
- b = – 3  rule: `choose(rand(16),-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9)`
- horiz_asymp = 2/7  rule: `fracs(a,c)`
- c = 7  rule: `range(2,9)`
- d = + 8  rule: `choose(rand(16),-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9)`
- a_dis = –2  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=d value=+ 8 offset=131338
  context: Which function has a horizontal asymptote with equation [[slot]] [[slot]]?
- #2 variable-ref ref=d value=+ 8 offset=131342
  context: Which function has a horizontal asymptote with equation [[slot]] [[slot]]?
- #3 variable-ref ref=d value=+ 8 offset=131354
  context: [[slot]]
- #4 variable-ref ref=d value=+ 8 offset=131364
  context: [[slot]]
- #5 variable-ref ref=horiz_asymp value=2/7 offset=131376
  context: [[slot]]
- #6 variable-ref ref=a_dis value=–2 offset=131386
  context: [[slot]]

## record-13 @ 135846

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | linear expressions in numerator and denominator | x-intercept
- Counts: strings=155, variables=6, display=9, refs=38, slots=5, visibleChoices=4

```text
Which function has an x-intercept of [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 6  rule: `range(2,9)`
- b = – 2  rule: `choose(rand(16),-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9)`
- x_int = 1/3  rule: `fracs(-b,a)`
- c = 5  rule: `range(2,9)`
- d = – 3  rule: `choose(rand(16),-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9)`
- a_dis = –6  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=x_int value=1/3 offset=137098
  context: Which function has an x-intercept of [[slot]]?
- #2 variable-ref ref=a_dis value=–6 offset=137110
  context: [[slot]]
- #3 variable-ref ref=b value=– 2 offset=137120
  context: [[slot]]
- #4 variable-ref ref=c value=5 offset=137132
  context: [[slot]]
- #5 variable-ref ref=d value=– 3 offset=137142
  context: [[slot]]

## record-14 @ 141152

- Metadata: Easy | Section 9.2 | RF14 | Analysing Rational Functions | quadratic denominator | vertical asymptote
- Counts: strings=169, variables=6, display=5, refs=41, slots=5, visibleChoices=4

```text
What is the equation for the vertical asymptote of the graph of the function shown?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = – 2  rule: `range(-7,7)`
- b = – 3  rule: `range(-7,7)`
- vert_asymp = 3  rule: `-1*b`
- y_var = 6  rule: `1/(hole+b)+c`
- hole = 2  rule: `-1*a`
- c = 7  rule: `range(-7,7)`

Inline slots:
- #1 variable-ref ref=b value=– 3 offset=142274
  context: What is the equation for the vertical asymptote of the graph of the function shown? [[slot]]
- #2 variable-ref ref=b value=– 3 offset=142284
  context: [[slot]]
- #3 variable-ref ref=hole value=2 offset=142292
  context: [[slot]]
- #4 variable-ref ref=y_var value=6 offset=142302
  context: [[slot]]
- #5 variable-ref ref=c value=7 offset=142310
  context: [[slot]]

## record-15 @ 155736

- Metadata: Easy | Section 9.2 | RF14 | Analysing Rational Functions | quadratic denominator | horizontal asymptote
- Counts: strings=169, variables=6, display=5, refs=44, slots=5, visibleChoices=4

```text
What is the equation for the horizontal asymptote of the graph of the function shown?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = + 6  rule: `range(-7,7)`
- b = + 5  rule: `range(-7,7)`
- vert_asymp = –5  rule: `-1*b`
- y_var = 2  rule: `1/(hole+b)+c`
- hole = –6  rule: `-1*a`
- c = 3  rule: `range(-7,7)`

Inline slots:
- #1 variable-ref ref=a value=+ 6 offset=156870
  context: What is the equation for the horizontal asymptote of the graph of the function shown? [[slot]]
- #2 variable-ref ref=b value=+ 5 offset=156880
  context: [[slot]]
- #3 variable-ref ref=hole value=–6 offset=156888
  context: [[slot]]
- #4 variable-ref ref=y_var value=2 offset=156898
  context: [[slot]]
- #5 variable-ref ref=c value=3 offset=156906
  context: [[slot]]

## record-16 @ 170332

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | quadratic denominator | graph from characteristics
- Counts: strings=202, variables=9, display=12, refs=51, slots=7, visibleChoices=4

```text
Which graph of a rational function has the following characteristics? a vertical asymptote with equation [[slot]] a horizontal asymptote with equation [[slot]] a point of discontinuity at [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = + 2  rule: `range(-4,4)`
- b = +  rule: `range(-4,4)`
- vert_asymp = –1  rule: `-1*b`
- y_var = –2  rule: `1/(hole+b)+c`
- hole = –2  rule: `-1*a`
- c = –1  rule: `range(-4,4)`
- y_var_dis = 1  rule: `1/(hole+c)+b`
- y_int = 2  rule: `-((a)/(a*c)-b)`
- x_int = 0  rule: `(-1/b)-c`

Inline slots:
- #1 variable-ref ref=vert_asymp value=–1 offset=171800
  context: a vertical asymptote with equation [[slot]]
- #2 variable-ref ref=c value=–1 offset=171882
  context: a horizontal asymptote with equation [[slot]]
- #3 variable-ref ref=hole value=–2 offset=171946
  context: a point of discontinuity at [[slot]]
- #4 variable-ref ref=y_var value=–2 offset=171960
  context: [[slot]]
- #5 variable-ref ref=x_int value=0 offset=171970
  context: [[slot]]
- #6 variable-ref ref=hole value=–2 offset=171982
  context: [[slot]]
- #7 variable-ref ref=y_var value=–2 offset=171992
  context: [[slot]]

## record-17 @ 213916

- Metadata: Difficult | Section 9.2 | RF14 | Analysing Rational Functions | quadratic denominator | function from characteristics
- Counts: strings=186, variables=9, display=12, refs=58, slots=7, visibleChoices=4

```text
Which rational function has the following characteristics? a vertical asymptote with equation [[slot]] a horizontal asymptote with equation [[slot]] a point of discontinuity at [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = – 3  rule: `range(-9,9)`
- b = – 2  rule: `range(-9,9)`
- c = + 8  rule: `range(-9,9)`
- vert_asymp = 2  rule: `-1*b`
- y_var = 9  rule: `1/(hole+b)+c`
- hole = 3  rule: `-1*a`
- a_dis = + 3  rule: `-1*a`
- b_dis1 = + 2  rule: `-1*b`
- c_dis2 = – 8  rule: `-1*c`

Inline slots:
- #1 variable-ref ref=vert_asymp value=2 offset=215406
  context: a vertical asymptote with equation [[slot]]
- #2 variable-ref ref=hole value=3 offset=215488
  context: a horizontal asymptote with equation [[slot]]
- #3 variable-ref ref=y_var value=9 offset=215552
  context: a point of discontinuity at [[slot]]
- #4 variable-ref ref=a value=– 3 offset=215566
  context: [[slot]]
- #5 variable-ref ref=a_dis value=+ 3 offset=215576
  context: [[slot]]
- #6 variable-ref ref=b value=– 2 offset=215588
  context: [[slot]]
- #7 variable-ref ref=c_dis2 value=– 8 offset=215598
  context: [[slot]]

## record-18 @ 221057

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | hole
- Counts: strings=127, variables=4, display=9, refs=28, slots=3, visibleChoices=4

```text
Which function has a graph in the shape of a parabola? A. [[slot]] C. [[slot]] B. [[slot]] D. none of the above
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. none of the above 7

Variables:
- a = – 3  rule: `range(-9,9)`
- b = – 7  rule: `range(-9,9)`
- n = 2  rule: `rand(5)`
- m = 3  rule: `n+1`

Inline slots:
- #1 variable-ref ref=a value=– 3 offset=221839
  context: [[slot]]
- #2 variable-ref ref=n value=2 offset=221849
  context: [[slot]]
- #3 variable-ref ref=b value=– 7 offset=221861
  context: [[slot]]

## record-19 @ 225243

- Metadata: Easy | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=109, variables=9, display=9, refs=13, slots=5, visibleChoices=4

```text
Solve the equation [[slot]]. A. x = [[slot]] C. x = [[slot]] B. x = [[slot]] D. x = [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. x = [[slot]]

Variables:
- a = –1  rule: `range(-9,9)`
- b = + 6  rule: `range(-9,9)`
- c = 8  rule: `range(-9,9)`
- e = 14  rule: `b+c`
- f = 49  rule: `b*c-a`
- ans = -7  rule: `fracs(-e,2)`
- dis = -1/7  rule: `fracs(2,-e)`
- dis2 = –6  rule: `-1*b`
- dis3 = –8  rule: `-1*c`

Inline slots:
- #1 variable-ref ref=a value=–1 offset=226361
  context: Solve the equation [[slot]].
- #2 variable-ref ref=b value=+ 6 offset=226381
  context: x = [[slot]]
- #3 variable-ref ref=c value=8 offset=226399
  context: x = [[slot]]
- #4 variable-ref ref=ans value=-7 offset=226419
  context: x = [[slot]]
- #5 variable-ref ref=dis2 value=–6 offset=226437
  context: x = [[slot]]

## record-20 @ 229219

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=102, variables=8, display=5, refs=14, slots=5, visibleChoices=4

```text
Solve the equation [[slot]]. x = [[slot]] x = [[slot]] x = [[slot]] x = [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. x = [[slot]] 8

Variables:
- a = –2  rule: `range(-9,9)`
- b = + 6  rule: `range(-9,9)`
- c = 3  rule: `range(-9,9)`
- ans_num = 18  rule: `c*b`
- ans_denom = –5  rule: `a-c`
- ans = -18/5  rule: `fracs(ans_num,ans_denom)`
- dis1 = 18/5  rule: `fracs(-ans_num,ans_denom)`
- dis2 = 4  rule: `a+b`

Inline slots:
- #1 variable-ref ref=a value=–2 offset=230377
  context: Solve the equation [[slot]].
- #2 variable-ref ref=a value=–2 offset=230395
  context: x = [[slot]]
- #3 variable-ref ref=b value=+ 6 offset=230411
  context: x = [[slot]]
- #4 variable-ref ref=c value=3 offset=230429
  context: x = [[slot]]
- #5 variable-ref ref=dis1 value=18/5 offset=230445
  context: x = [[slot]]

## record-21 @ 233459

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=121, variables=10, display=9, refs=15, slots=6, visibleChoices=4

```text
Solve the equation [[slot]]. A. x = [[slot]] C. x = [[slot]] B. x = [[slot]] D. x = [[slot]], x = [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. x = [[slot]], x = [[slot]]

Variables:
- a = + 3  rule: `range(-9,9)`
- b = – 8  rule: `range(-9,9)`
- c = + 9  rule: `range(-9,9)`
- b1 = + 8  rule: `-1*b`
- num = –91  rule: `-a*c-b^2`
- denom = 12  rule: `a+c`
- ans = -91/12  rule: `fracs(num,denom)`
- dis1 = 91/12  rule: `fracs(-num,denom)`
- dis2 = –9  rule: `-1*c`
- dis4 = –3  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=a value=+ 3 offset=234843
  context: Solve the equation [[slot]].
- #2 variable-ref ref=b value=– 8 offset=234863
  context: x = [[slot]]
- #3 variable-ref ref=b1 value=+ 8 offset=234881
  context: x = [[slot]]
- #4 variable-ref ref=c value=+ 9 offset=234901
  context: x = [[slot]]
- #5 variable-ref ref=dis4 value=–3 offset=234919
  context: x = [[slot]], x = [[slot]]
- #6 variable-ref ref=ans value=-91/12 offset=234933
  context: x = [[slot]], x = [[slot]]

## record-22 @ 237964

- Metadata: Easy | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=119, variables=3, display=5, refs=26, slots=6, visibleChoices=4

```text
Solve the equation [[slot]]. [[slot]] no solution x = [[slot]], x = [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. x = [[slot]], x = [[slot]]
- C. no solution
- D. [[slot]] [[slot]]

Variables:
- a = 2  rule: `range(1,9)`
- b = 9  rule: `range(1,9)`
- ans = 3/2  rule: `sqrs(a*b)`

Inline slots:
- #1 variable-ref ref=a value=2 offset=238574
  context: Solve the equation [[slot]].
- #2 variable-ref ref=a value=2 offset=238584
  context: [[slot]]
- #3 variable-ref ref=b value=9 offset=238630
  context: x = [[slot]], x = [[slot]]
- #4 variable-ref ref=b value=9 offset=238644
  context: x = [[slot]], x = [[slot]]
- #5 variable-ref ref=b value=9 offset=238652
  context: [[slot]] [[slot]]
- #6 variable-ref ref=b value=9 offset=238656
  context: [[slot]] [[slot]]

## record-23 @ 242635

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational function | x-intercept
- Counts: strings=273, variables=12, display=9, refs=47, slots=9, visibleChoices=4

```text
What are the x-intercepts of the graph of [[slot]]? A. [[slot]], [[slot]] C. [[slot]], [[slot]] B. [[slot]], [[slot]] D. [[slot]], [[slot]]
```

Choices:
- A. [[slot]], [[slot]]
- B. [[slot]], [[slot]]
- C. [[slot]], [[slot]]
- D. [[slot]], [[slot]]

Variables:
- a = –2  rule: `range(-9,9)`
- b = 9  rule: `range(-9,9)`
- c = 7  rule: `range(-9,9)`
- d = 5  rule: `range(-9,9)`
- e = + 7  rule: `a+b`
- f = – 18  rule: `a*b`
- g = + 12  rule: `c+d`
- h = + 35  rule: `c*d`
- c_dis = –7  rule: `-1*c`
- d_dis = –5  rule: `-1*d`
- ans_a = 2  rule: `-a`
- ans_b = –9  rule: `-b`

Inline slots:
- #1 variable-ref ref=h value=+ 35 offset=244175
  context: What are the x-intercepts of the graph of [[slot]]?
- #2 variable-ref ref=h value=+ 35 offset=244187
  context: [[slot]], [[slot]]
- #3 variable-ref ref=h value=+ 35 offset=244193
  context: [[slot]], [[slot]]
- #4 variable-ref ref=h value=+ 35 offset=244203
  context: [[slot]], [[slot]]
- #5 variable-ref ref=e value=+ 7 offset=244209
  context: [[slot]], [[slot]]
- #6 variable-ref ref=f value=– 18 offset=244221
  context: [[slot]], [[slot]]
- #7 variable-ref ref=g value=+ 12 offset=244227
  context: [[slot]], [[slot]]
- #8 variable-ref ref=h value=+ 35 offset=244237
  context: [[slot]], [[slot]]
- #9 variable-ref ref=d value=5 offset=244243
  context: [[slot]], [[slot]]

## record-24 @ 256340

- Metadata: Easy | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of linear function | vertical asymptote
- Counts: strings=59, variables=3, display=1, refs=14, slots=1, visibleChoices=0

```text
The rational function [[slot]] has a vertical asymptote with equation _______________.
```

Variables:
- a = –17  rule: `range(-20,20)`
- b = – 17  rule: `range(-20,20)`
- ans = -1  rule: `fracs(-b,a)`

Inline slots:
- #1 variable-ref ref=a value=–17 offset=256976
  context: The rational function [[slot]] has a vertical asymptote with equation _______________.

## record-25 @ 259488

- Metadata: Easy | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function | y-intercept
- Counts: strings=40, variables=3, display=1, refs=8, slots=1, visibleChoices=0

```text
The rational function [[slot]] has a y-intercept of _______________.
```

Variables:
- a = 13  rule: `range(-20,20)`
- b = – 11  rule: `range(-20,20)`
- ans = -13/11  rule: `fracs(a,b)`

Inline slots:
- #1 variable-ref ref=a value=13 offset=260128
  context: The rational function [[slot]] has a y-intercept of _______________.

## record-26 @ 262185

- Metadata: Easy | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | zeros | roots | x-intercept
- Counts: strings=54, variables=5, display=2, refs=12, slots=2, visibleChoices=0

```text
The number of x-intercepts in the graph of [[slot]] is _______________. [[slot]]
```

Variables:
- a = + 3  rule: `range(-9,9)`
- b = + 8  rule: `range(-9,9)`
- c = + 4  rule: `range(-9,9)`
- d = + 8  rule: `range(-9,9)`
- ans = 2  rule: `if((a=d or b=d or c=d),2,3)`

Inline slots:
- #1 variable-ref ref=a value=+ 3 offset=263109
  context: The number of x-intercepts in the graph of [[slot]] is _______________.
- #2 variable-ref ref=b value=+ 8 offset=263357
  context: [[slot]]

## record-27 @ 265116

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | point of discontinuity | vertical asymptote
- Counts: strings=37, variables=3, display=1, refs=5, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
Given a rational function, if [[slot]] is a restriction, then [[slot]] could be the [[slot]] or the _______________.
```

Variables:
- num = 2  rule: `rand(2)`
- option1 = location of a point of discontinuity  rule: `if(num=1,"equation of a vertical asymptote","location of a point of discontinuity")`
- option2 = equation of a vertical asymptote  rule: `if(num=2,"equation of a vertical asymptote","location of a point of discontinuity")`

Inline slots:
- #1 variable-ref ref=option1 value=location of a point of discontinuity offset=266092
  context: Given a rational function, if [[slot]] is a restriction, then [[slot]] could be the [[slot]] or the _______________.
- #2 variable-ref ref=option2 value=equation of a vertical asymptote offset=266142
  context: Given a rational function, if [[slot]] is a restriction, then [[slot]] could be the [[slot]] or the _______________.
- #3 math-object ref=- value=- offset=266172
  context: Given a rational function, if [[slot]] is a restriction, then [[slot]] could be the [[slot]] or the _______________.

## record-28 @ 268116

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | graph | rational function
- Counts: strings=75, variables=6, display=1, refs=23, slots=1, visibleChoices=0

```text
When solving the rational function [[slot]] graphically, the single function that could be graphed is _______________.
```

Variables:
- a = – 8  rule: `range(-9,9)`
- b = – 6  rule: `range(-9,9)`
- c = –4  rule: `range(-9,9)`
- d = + 3  rule: `range(-9,9)`
- e = + 2  rule: `range(-9,9)`
- e1 = – 2  rule: `-1*e`

Inline slots:
- #1 variable-ref ref=a value=– 8 offset=269090
  context: When solving the rational function [[slot]] graphically, the single function that could be graphed is _______________.

## record-29 @ 271645

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | rational functions | graphs
- Counts: strings=24, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=271873
  context: [[slot]]

## record-30 @ 278819

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | rational functions | graphs
- Counts: strings=25, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=279047
  context: [[slot]]

## record-31 @ 285993

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | rational functions | graphs
- Counts: strings=28, variables=0, display=1, refs=7, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=286221
  context: [[slot]]

## record-32 @ 294963

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | rational functions | graphs
- Counts: strings=28, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=295191
  context: [[slot]]

## record-33 @ 303933

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | rational functions | graphs
- Counts: strings=27, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=304161
  context: [[slot]]

## record-34 @ 312903

- Metadata: Average | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | reciprocal of linear function | vertical asymptote | y-intercept | graph
- Counts: strings=58, variables=0, display=1, refs=15, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Determine an equation in the form [[slot]] for a function with a vertical asymptote at [[slot]] and a y-intercept of [[slot]].b) Sketch the graph of the function.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=313339
  context: a) Determine an equation in the form [[slot]] for a function with a vertical asymptote at [[slot]] and a y-intercept of [[slot]]. b) Sk
- #2 math-object ref=- value=- offset=313431
  context: a) Determine an equation in the form [[slot]] for a function with a vertical asymptote at [[slot]] and a y-intercept of [[slot]]. b) Sketch the graph of the function. [[slot]]
- #3 math-object ref=- value=- offset=313477
  context: e form [[slot]] for a function with a vertical asymptote at [[slot]] and a y-intercept of [[slot]]. b) Sketch the graph of the function. [[slot]]
- #4 math-object ref=- value=- offset=313557
  context: asymptote at [[slot]] and a y-intercept of [[slot]]. b) Sketch the graph of the function. [[slot]]

## record-35 @ 324486

- Metadata: Easy | Section 9.1 | RF14 | Exploring Rational Functions Using Transformations | graph | characteristics | transformations
- Counts: strings=232, variables=0, display=1, refs=71, slots=2, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of the function [[slot]] using transformations and identifya) the vertical asymptotes (if any)b) the horizontal asymptotes (if any)c) the domain and ranged) the behaviour near any non-permissible valuese) the end behaviour[[slot]]
```

Choices:
- H. j

Inline slots:
- #1 math-object ref=- value=- offset=324846
  context: Sketch the graph of the function [[slot]] using transformations and identify a) the vertical asymptotes (if any) b) the horizontal
- #2 unknown-object ref=- value=- offset=325256
  context: he domain and range d) the behaviour near any non-permissible values e) the end behaviour [[slot]]

## record-36 @ 349074

- Metadata: Average | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | reciprocal of linear function | key features | graph
- Counts: strings=75, variables=0, display=1, refs=15, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts iii) equations of any asymptotesb) Sketch the graph of the function.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=349510
  context: Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts ii
- #2 math-object ref=- value=- offset=349828
  context: ge ii) intercepts iii) equations of any asymptotes b) Sketch the graph of the function. [[slot]]

## record-37 @ 361768

- Metadata: Average | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | reciprocal of linear function | key features | graph
- Counts: strings=91, variables=0, display=1, refs=20, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts iii) equations of any asymptotesb) Sketch the graph of the function.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=362204
  context: Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts ii
- #2 math-object ref=- value=- offset=362522
  context: ge ii) intercepts iii) equations of any asymptotes b) Sketch the graph of the function. [[slot]]

## record-38 @ 374916

- Metadata: Difficult | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | reciprocal of quadratic function | key features | graph
- Counts: strings=92, variables=0, display=1, refs=21, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts iii) equations of any asymptotesb) Sketch the graph of the function.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=375362
  context: Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts ii
- #2 math-object ref=- value=- offset=375680
  context: ge ii) intercepts iii) equations of any asymptotes b) Sketch the graph of the function. [[slot]]

## record-39 @ 389826

- Metadata: Average | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | linear expressions in numerator and denominator | key features | graph
- Counts: strings=95, variables=0, display=1, refs=22, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts iii) equations of any asymptotesb) Sketch the graph of the function.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=390298
  context: Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts ii
- #2 math-object ref=- value=- offset=390616
  context: ge ii) intercepts iii) equations of any asymptotes b) Sketch the graph of the function. [[slot]]

## record-40 @ 404859

- Metadata: Difficult | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | rational function | key features | graph
- Counts: strings=97, variables=0, display=1, refs=21, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts iii) equations of any asymptotesb) Sketch the graph of the function.
```

Inline slots:
- #1 math-object ref=- value=- offset=405275
  context: Consider the function [[slot]]. a) Determine the key features of the function: i) domain and range ii) intercepts ii

## record-41 @ 417808

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=143, variables=0, display=2, refs=37, slots=5, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve. a) [[slot]]b) [[slot]]c) [[slot]]d) [[slot]] [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=418062
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #2 unknown-object ref=- value=- offset=418072
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #3 unknown-object ref=- value=- offset=418082
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #4 unknown-object ref=- value=- offset=418092
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #5 unknown-object ref=- value=- offset=418324
  context: [[slot]]

## record-42 @ 425127

- Metadata: Difficult | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation | technology
- Counts: strings=143, variables=0, display=1, refs=37, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve each equation by graphing, using technology. Express your answers to two decimal places. a) [[slot]]b) [[slot]]c) [[slot]]d) [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=425587
  context: h equation by graphing, using technology. Express your answers to two decimal places. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #2 unknown-object ref=- value=- offset=425597
  context: y graphing, using technology. Express your answers to two decimal places. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #3 unknown-object ref=- value=- offset=425607
  context: using technology. Express your answers to two decimal places. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #4 unknown-object ref=- value=- offset=425617
  context: logy. Express your answers to two decimal places. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]

## record-43 @ 431550

- Metadata: Easy | Section 9.1 | Section 9.3 | RF14 | Exploring Rational Functions Using Transformations | Connecting Graphs and Rational Equations | word problem | reciprocal of linear function | graph
- Counts: strings=29, variables=0, display=1, refs=4, slots=0, visibleChoices=0

```text
The time, t, in hours, that it takes Alistair to jog 5 km is inversely proportional to his average speed, v, in kilometres per hour. a) Write a function to represent the time as a function of the speed. b) Sketch the graph of this function. c) If Alistair jogs at 4.5 km/h, how long does it take him to complete a 5-km run, to the nearest minute?
```

## record-44 @ 438796

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | reciprocal of quadratic function | graph
- Counts: strings=65, variables=0, display=2, refs=15, slots=0, visibleChoices=0

```text
The pressure exerted on the floor by the heel of someone s shoe is inversely proportional to the square of the width of the heel of the shoe. When Megumi wears 2-cm-wide heels, she exerts a pressure of 400 kPa. a) Determine a function to represent the pressure, p, exerted by Megumi if she wears heels of width w. b) Sketch the graph of this function.c) If she wears spike heels with a width of 0.5 cm, what pressure does she exert?
```

## record-45 @ 448277

- Metadata: Average | Section 9.1 | Section 9.3 | RF14 | Exploring Rational Functions Using Transformations | Connecting Graphs and Rational Equations | reciprocal of quadratic function | average rate of change
- Counts: strings=258, variables=0, display=1, refs=65, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A photographer uses a light meter to measure the intensity of light from a flash bulb. The intensity, I, in lux, of the flash bulb is a function of the distance, d, in metres, from the light and can be represented by [[slot]]. a) Determine the following, to two decimal places: i) the intensity of light 3 m from the flash bulb ii) the average rate of change in the intensity of light for the interval [[slot]]b) What does the sign of your answer to part a)ii) indicate about the light intensity?
```

Inline slots:
- #1 math-object ref=- value=- offset=449157
  context: ulb is a function of the distance, d, in metres, from the light and can be represented by [[slot]]. a) Determine the following, to two decimal places: i) the intensity of light 3 m from
- #2 unknown-object ref=- value=- offset=449519
  context: the flash bulb ii) the average rate of change in the intensity of light for the interval [[slot]] b) What does the sign of your answer to part a)ii) indicate about the light intensity?

## record-46 @ 477934

- Metadata: Difficult | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function
- Counts: strings=64, variables=0, display=4, refs=16, slots=6, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Write an equation to represent a rational function with the following conditions: reciprocal of a quadratic function asymptotes with equations [[slot]], [[slot]], and [[slot]] [[slot]] whenever [[slot]] or [[slot]]b) How many such equations are there? Explain your answer.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=478474
  context: asymptotes with equations [[slot]], [[slot]], and [[slot]]
- #2 unknown-object ref=- value=- offset=478480
  context: asymptotes with equations [[slot]], [[slot]], and [[slot]]
- #3 unknown-object ref=- value=- offset=478494
  context: asymptotes with equations [[slot]], [[slot]], and [[slot]]
- #4 unknown-object ref=- value=- offset=478502
  context: [[slot]] whenever [[slot]] or [[slot]] b) How many such equations are there? Explain your answer.
- #5 unknown-object ref=- value=- offset=478524
  context: [[slot]] whenever [[slot]] or [[slot]] b) How many such equations are there? Explain your answer.
- #6 unknown-object ref=- value=- offset=478534
  context: [[slot]] whenever [[slot]] or [[slot]] b) How many such equations are there? Explain your answer.

## record-47 @ 482409

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | reciprocal of quadratic function
- Counts: strings=56, variables=0, display=1, refs=12, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Write an equation for the graph of the rational function shown. Explain your reasoning.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=482823
  context: Write an equation for the graph of the rational function shown. Explain your reasoning. [[slot]]

## record-48 @ 493180

- Metadata: Average | Section 9.2 | RF14 | Analysing Rational Functions | linear expressions in numerator and denominator | graph | key features
- Counts: strings=75, variables=0, display=1, refs=22, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) The graph of a function of the form [[slot]] is shown. Determine the key features: i) domain and range ii) intercepts iii) equations of any asymptotes [[slot]] b) State a possible equation for this function.
```

Inline slots:
- #1 math-object ref=- value=- offset=493572
  context: a) The graph of a function of the form [[slot]] is shown. Determine the key features: i) domain and range ii) intercepts iii) equation
- #2 math-object ref=- value=- offset=493796
  context: the key features: i) domain and range ii) intercepts iii) equations of any asymptotes [[slot]] b) State a possible equation for this function.

## record-49 @ 505922

- Metadata: Difficult | Section 9.2 | RF14 | Analysing Rational Functions | linear expressions in numerator and denominator | graph
- Counts: strings=175, variables=9, display=1, refs=17, slots=2, visibleChoices=0

```text
The equation [[slot]] has one solution, x = –6. However, there are infinitely many solutions to [[slot]], with x = –6 being one of them, acting as a boundary on the interval of solutions for x.
```

Variables:
- z = %  rule: `|`
- p = :  rule: `:`
- o = 4  rule: `3`
- x = 4  rule: `8`
- y = ?  rule: `-inf`
- inf = -inf  rule: `(3*x+8)/(4*x+4)`
- m = 4  rule: `3`
- RF14 = rational inequality | rational equation  rule: `Exploring Rational Functions Using Transformations | Connecting Graphs and Rational Equations`
- c = <  rule: `Explain the difference between the solution to the equation [[slot]] and the solution to the inequality [[slot]].`

Inline slots:
- #1 variable-ref ref=x value=4 offset=519924
  context: The equation [[slot]] has one solution, x = –6. However, there are infinitely many solutions to [[slot]], with
- #2 variable-ref ref=x value=4 offset=520076
  context: uation [[slot]] has one solution, x = –6. However, there are infinitely many solutions to [[slot]], with x = –6 being one of them, acting as a boundary on the interval of solutions for x.

## record-50 @ 526322

- Metadata: Difficult | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | rational function | hole
- Counts: strings=23, variables=0, display=5, refs=0, slots=0, visibleChoices=0

```text
Write an equation for a rational function whose graph has all of the following features: vertical asymptote with equation x = 3 horizontal asymptote with equation y = 2 hole at x = 1 no x-intercepts
```

## record-51 @ 528904

- Metadata: Difficult | Section 9.2 | Section 9.3 | RF14 | Analysing Rational Functions | Connecting Graphs and Rational Equations | linear expressions in numerator and denominator | graph | reciprocal
- Counts: strings=676, variables=8, display=1, refs=55, slots=4, visibleChoices=0

```text
Solve each inequality by graphing, using technology. Express your answers to one decimal place. a) [[slot]]b) [[slot]]c) [[slot]]d) [[slot]]
```

Variables:
- v = 5  rule: `1`
- d = P  rule: `[[slot]]`
- y = ?  rule: `-inf`
- inf = -inf  rule: `(x+1)/(x-5)`
- r = <  rule: `<`
- RF14 = linear expressions in numerator and denominator | graph | increasing | decreasing | reciprocal  rule: `Analysing Rational Functions | Connecting Graphs and Rational Equations`
- p = :  rule: `:`
- o = 9  rule: `9`

Inline slots:
- #1 variable-ref ref=d value=P offset=565652
  context: inequality by graphing, using technology. Express your answers to one decimal place. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #2 variable-ref ref=d value=P offset=565662
  context: by graphing, using technology. Express your answers to one decimal place. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #3 variable-ref ref=d value=P offset=565672
  context: using technology. Express your answers to one decimal place. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #4 variable-ref ref=d value=P offset=565682
  context: ology. Express your answers to one decimal place. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]

## record-52 @ 576372

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=39, variables=0, display=2, refs=8, slots=5, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve. a) [[slot]]b) [[slot]]c) [[slot]]d) [[slot]] [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=576626
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #2 unknown-object ref=- value=- offset=576636
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #3 unknown-object ref=- value=- offset=576646
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #4 unknown-object ref=- value=- offset=576656
  context: Solve. a) [[slot]] b) [[slot]] c) [[slot]] d) [[slot]]
- #5 unknown-object ref=- value=- offset=576888
  context: [[slot]]

## record-53 @ 579967

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | rational equation
- Counts: strings=97, variables=0, display=2, refs=34, slots=0, visibleChoices=0

```text
An airplane makes a 990-mi flight with a tail wind and returns, flying into the wind. The total flying time is 3 h 20 min, and the plane s airspeed is 600 mph. What is the wind speed?
```

## record-54 @ 585053

- Metadata: Difficult | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | quadratic denominator | extraneous solution
- Counts: strings=167, variables=0, display=1, refs=26, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the solution to the rational equation [[slot]]?
```

Inline slots:
- #1 math-object ref=- value=- offset=585433
  context: What is the solution to the rational equation [[slot]]?

## record-55 @ 592063

- Metadata: Average | Section 9.3 | RF14 | Connecting Graphs and Rational Equations | linear expressions in numerator and denominator | x-intercept | excluded solution
- Counts: strings=556, variables=0, display=1, refs=157, slots=0, visibleChoices=0

```text
A ski club charters a bus for a ski trip at a cost of $480. In an attempt to lower the bus fare per skier, the club invites non-members to go along. After five non-members join the trip, the fare per skier decreases by $4.80. How many club members are going on the trip?
```

