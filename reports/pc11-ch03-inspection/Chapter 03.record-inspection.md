# Record Inspection: Chapter 03.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 11/Chapter 03.bnk`
- Inflated bytes: 1118890
- Records: 63
- Inline slots: 240
- Slot classes: variable-ref=209, unknown-object=21, math-object=8, diagram-object=2

## record-1 @ 4628

- Metadata: Easy | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | intercept
- Counts: strings=131, variables=8, display=5, refs=24, slots=9, visibleChoices=4

```text
What are the x-intercepts of [[slot]]? [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]]
```

Choices:
- A. [[slot]] and [[slot]]
- B. [[slot]] and [[slot]]
- C. [[slot]] and [[slot]]
- D. [[slot]] and [[slot]]

Variables:
- VAR1 = 6  rule: `range(-9,9,1)`
- VAR2 = 9  rule: `range(-9,9,1)`
- SIGN1 = ?  rule: `if(VAR1<0,chr(43),chr(45))`
- SIGN2 = ?  rule: `if(VAR2<0,chr(43),chr(45))`
- INT1 = 6  rule: `abs(VAR1)`
- INT2 = 9  rule: `abs(VAR2)`
- OPPVAR1 = –6  rule: `-1*VAR1`
- OPPVAR2 = –9  rule: `-1*VAR2`

Inline slots:
- #1 variable-ref ref=SIGN1 value=if(VAR1<0,chr(43),chr(45)) offset=5850
  context: What are the x-intercepts of [[slot]]?
- #2 variable-ref ref=INT1 value=6 offset=5862
  context: [[slot]] and [[slot]]
- #3 variable-ref ref=SIGN2 value=if(VAR2<0,chr(43),chr(45)) offset=5874
  context: [[slot]] and [[slot]]
- #4 variable-ref ref=INT2 value=9 offset=5882
  context: [[slot]] and [[slot]]
- #5 variable-ref ref=VAR1 value=6 offset=5894
  context: [[slot]] and [[slot]]
- #6 variable-ref ref=VAR2 value=9 offset=5904
  context: [[slot]] and [[slot]]
- #7 variable-ref ref=OPPVAR1 value=–6 offset=5916
  context: [[slot]] and [[slot]]
- #8 variable-ref ref=VAR2 value=9 offset=5924
  context: [[slot]] and [[slot]]
- #9 variable-ref ref=OPPVAR1 value=–6 offset=5936
  context: [[slot]] and [[slot]]

## record-2 @ 9556

- Metadata: Easy | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | axis of symmetry
- Counts: strings=129, variables=8, display=5, refs=15, slots=5, visibleChoices=4

```text
What is the axis of symmetry of [[slot]]? x = [[slot]] x = [[slot]] x = [[slot]] x = [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. x = [[slot]]

Variables:
- VAR1 = 2  rule: `range(-9,9,1)`
- VAR2 = + 6  rule: `range(-9,9,1)`
- SIGN3 = ?  rule: `if(VAR3<0,chr(43),chr(45))`
- SIGN2 = ?  rule: `if(VAR2<0,chr(43),chr(45))`
- OPPVAR3 = 3  rule: `-1*VAR3`
- ANS = –6  rule: `-1*VAR2`
- VAR3 = – 3  rule: `range(-9,9,1)`
- DIS = 6  rule: `-1*ANS`

Inline slots:
- #1 variable-ref ref=VAR1 value=2 offset=11104
  context: What is the axis of symmetry of [[slot]]?
- #2 variable-ref ref=var2 value=+ 6 offset=11124
  context: x = [[slot]]
- #3 variable-ref ref=VAR3 value=– 3 offset=11140
  context: x = [[slot]]
- #4 variable-ref ref=ANS value=–6 offset=11158
  context: x = [[slot]]
- #5 variable-ref ref=DIS value=6 offset=11174
  context: x = [[slot]]

## record-3 @ 14183

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form
- Counts: strings=209, variables=12, display=5, refs=49, slots=5, visibleChoices=4

```text
What is the quadratic function in vertex form for the parabola shown below?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –8  rule: `range(-9,9,.25)`
- p = 1  rule: `range(-9,9,1)`
- q = 2  rule: `range(-9,9,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = 1  rule: `abs(p)`
- q_value = 2  rule: `abs(q)`
- p_dis1 = –1  rule: `-1*p_value`
- q_dis1 = –2  rule: `-1*q_value`
- a_dis1 = 8  rule: `-1*a`
- sign_dis_p = ?  rule: `if(p<0,chr(45),chr(43))`
- sign_dis_q = ?  rule: `if(q<0,chr(43),chr(45))`

Inline slots:
- #1 variable-ref ref=a value=–8 offset=15973
  context: What is the quadratic function in vertex form for the parabola shown below? [[slot]]
- #2 variable-ref ref=sign_p value=if(p<0,chr(43),chr(45)) offset=15981
  context: [[slot]]
- #3 variable-ref ref=q_value value=2 offset=15989
  context: [[slot]]
- #4 variable-ref ref=sign_q value=if(q<0,chr(45),chr(43)) offset=15999
  context: [[slot]]
- #5 variable-ref ref=p_value value=1 offset=16007
  context: [[slot]]

## record-4 @ 25019

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex
- Counts: strings=137, variables=11, display=5, refs=24, slots=9, visibleChoices=4

```text
What is the vertex of [[slot]]? ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]])
```

Choices:
- A. ([[slot]], [[slot]])
- B. ([[slot]], [[slot]])
- C. ([[slot]], [[slot]])
- D. ([[slot]], [[slot]])

Variables:
- VAR1 = 7  rule: `range(-9,9,1)`
- VAR2 = 5  rule: `range(-9,9,1)`
- SIGN3 = ?  rule: `if(VAR3<0,chr(45),chr(43))`
- SIGN2 = ?  rule: `if(VAR2<0,chr(45),chr(43))`
- p = 5  rule: `abs(VAR2)`
- OPPVAR3 = –4  rule: `-1*VAR3`
- VAR3 = 4  rule: `range(-9,9,1)`
- q = 4  rule: `abs(VAR3)`
- ANSx = –5  rule: `-1*VAR2`
- DISx1 = 5  rule: `-1*ANSx`
- DISy1 = –4  rule: `-1*ANSy`

Inline slots:
- #1 variable-ref ref=VAR1 value=7 offset=26531
  context: What is the vertex of [[slot]]?
- #2 variable-ref ref=SIGN2 value=if(VAR2<0,chr(45),chr(43)) offset=26545
  context: ([[slot]], [[slot]])
- #3 variable-ref ref=p value=5 offset=26551
  context: ([[slot]], [[slot]])
- #4 variable-ref ref=SIGN3 value=if(VAR3<0,chr(45),chr(43)) offset=26563
  context: ([[slot]], [[slot]])
- #5 variable-ref ref=q value=4 offset=26569
  context: ([[slot]], [[slot]])
- #6 variable-ref ref=DISx1 value=5 offset=26583
  context: ([[slot]], [[slot]])
- #7 variable-ref ref=ANSx value=–5 offset=26589
  context: ([[slot]], [[slot]])
- #8 variable-ref ref=DISy1 value=–4 offset=26601
  context: ([[slot]], [[slot]])
- #9 variable-ref ref=DISx1 value=5 offset=26607
  context: ([[slot]], [[slot]])

## record-5 @ 30237

- Metadata: Difficult | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form | graph
- Counts: strings=175, variables=12, display=5, refs=29, slots=5, visibleChoices=4

```text
Which graph represents the quadratic function [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 0.714285714286  rule: `n/d`
- p = 4  rule: `range(-6,6,1)`
- q = –7  rule: `range(-10,10,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- value_p = 4  rule: `abs(p)`
- value_q = 7  rule: `abs(q)`
- n = 5  rule: `range(-9,9,1)`
- d = 7  rule: `range(-9,9,1)`
- sign_a = abs(n)<abs(d)  rule: `if((n*d)<0,chr(45),chr(32))`
- numerator = 5  rule: `abs(n)/(gcf(abs(n),abs(d)))`
- denominator = 7  rule: `abs(d)/(gcf(abs(n),abs(d)))`

Inline slots:
- #1 variable-ref ref=sign_a value=abs(n)<abs(d) offset=32203
  context: Which graph represents the quadratic function [[slot]]?
- #2 variable-ref ref=numerator value=5 offset=32215
  context: [[slot]]
- #3 variable-ref ref=denominator value=7 offset=32223
  context: [[slot]]
- #4 variable-ref ref=sign_p value=if(p<0,chr(43),chr(45)) offset=32233
  context: [[slot]]
- #5 variable-ref ref=value_p value=4 offset=32241
  context: [[slot]]

## record-6 @ 52132

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | domain | range
- Counts: strings=240, variables=9, display=5, refs=65, slots=9, visibleChoices=4

```text
What are the domain and range of [[slot]]? Domain: [[slot]]Range: [[slot]] Domain: [[slot]]Range: [[slot]] Domain: [[slot]]Range: [[slot]] Domain: [[slot]]Range: [[slot]]
```

Choices:
- A. Domain: [[slot]]Range: [[slot]]
- B. Domain: [[slot]]Range: [[slot]]
- C. Domain: [[slot]]Range: [[slot]]
- D. Domain: [[slot]]Range: [[slot]]

Variables:
- VAR1 = 7  rule: `range(-9,9,1)`
- VAR2 = –1  rule: `range(-9,9,1)`
- SIGN3 = ?  rule: `if(VAR3<0,chr(45),chr(43))`
- SIGN2 = ?  rule: `if(VAR2<0,chr(45),chr(43))`
- p = 1  rule: `abs(VAR2)`
- VAR3 = –9  rule: `range(-9,9,1)`
- q = 9  rule: `abs(VAR3)`
- inequality = ?  rule: `if(VAR1<0,chr(163),chr(179))`
- dis_inequality = {  rule: `if(VAR1<0,chr(179),chr(163))`

Inline slots:
- #1 variable-ref ref=VAR1 value=7 offset=53522
  context: What are the domain and range of [[slot]]?
- #2 variable-ref ref=SIGN2 value=if(VAR2<0,chr(45),chr(43)) offset=53550
  context: Domain: [[slot]] Range: [[slot]]
- #3 variable-ref ref=p value=1 offset=53568
  context: Domain: [[slot]] Range: [[slot]]
- #4 variable-ref ref=SIGN3 value=if(VAR3<0,chr(45),chr(43)) offset=53592
  context: Domain: [[slot]] Range: [[slot]]
- #5 variable-ref ref=q value=9 offset=53610
  context: Domain: [[slot]] Range: [[slot]]
- #6 variable-ref ref=dis_inequality value={ offset=53636
  context: Domain: [[slot]] Range: [[slot]]
- #7 variable-ref ref=VAR2 value=–1 offset=53654
  context: Domain: [[slot]] Range: [[slot]]
- #8 variable-ref ref=inequality value=if(VAR1<0,chr(163),chr(179)) offset=53678
  context: Domain: [[slot]] Range: [[slot]]
- #9 variable-ref ref=VAR1 value=7 offset=53696
  context: Domain: [[slot]] Range: [[slot]]

## record-7 @ 60438

- Metadata: Difficult | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex | y-intercept
- Counts: strings=174, variables=11, display=5, refs=53, slots=6, visibleChoices=4

```text
The vertex of a parabola is located at [[slot]]. If the parabola has a y-intercept of [[slot]], which quadratic function represents the parabola? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 9  rule: `range(-10,10,1)`
- p = –5  rule: `range(-6,6,1)`
- q = 6  rule: `range(-10,10,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- value_p = 5  rule: `abs(p)`
- value_q = 6  rule: `abs(q)`
- y_int = 231  rule: `a*p*p+q`
- dis_sign_p = ?  rule: `if(p<0,chr(45),chr(43))`
- dis_sign_q = ?  rule: `if(q<0,chr(43),chr(45))`
- dis_a = –9  rule: `-1*a`

Inline slots:
- #1 variable-ref ref=p value=–5 offset=62004
  context: The vertex of a parabola is located at [[slot]]. If the parabola has a y-intercept of [[slot]], which quadratic function represents the p
- #2 variable-ref ref=q value=6 offset=62084
  context: The vertex of a parabola is located at [[slot]]. If the parabola has a y-intercept of [[slot]], which quadratic function represents the parabola?
- #3 variable-ref ref=y_int value=231 offset=62196
  context: [[slot]]
- #4 variable-ref ref=a value=9 offset=62204
  context: [[slot]]
- #5 variable-ref ref=dis_sign_p value=if(p<0,chr(45),chr(43)) offset=62214
  context: [[slot]]
- #6 variable-ref ref=value_p value=5 offset=62222
  context: [[slot]]

## record-8 @ 67206

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex | direction of opening
- Counts: strings=150, variables=14, display=5, refs=30, slots=13, visibleChoices=5

```text
What information can be determined from the quadratic function [[slot]]? the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]] the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]] the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]] the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
```

Choices:
- A. the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- B. the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- C. the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- D. the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- E. s

Variables:
- a = 0.666666666667  rule: `n/d`
- p = –2  rule: `range(-10,10,1)`
- q = –9  rule: `range(-10,10,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- value_p = 2  rule: `abs(p)`
- value_q = 9  rule: `abs(q)`
- n = –4  rule: `range(-9,9,1)`
- d = –6  rule: `range(-9,9,1)`
- sign_a = abs(n)<abs(d)  rule: `if((n*d)<0,chr(45),chr(32))`
- numerator = 2  rule: `abs(n)/(gcf(abs(n),abs(d)))`
- denominator = 3  rule: `abs(d)/(gcf(abs(n),abs(d)))`
- direction = upward  rule: `if(a<0,"downward","upward")`
- dis_direction = downward  rule: `if(a<0,"upward","downward")`

Inline slots:
- #1 variable-ref ref=q value=–9 offset=69494
  context: What information can be determined from the quadratic function [[slot]]?
- #2 variable-ref ref=sign_a value=abs(n)<abs(d) offset=69542
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #3 variable-ref ref=numerator value=2 offset=69548
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #4 variable-ref ref=denominator value=3 offset=69594
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #5 variable-ref ref=sign_p value=if(p<0,chr(43),chr(45)) offset=69640
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #6 variable-ref ref=value_p value=2 offset=69646
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #7 variable-ref ref=sign_q value=if(q<0,chr(45),chr(43)) offset=69692
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #8 variable-ref ref=value_q value=9 offset=69738
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #9 variable-ref ref=d value=–6 offset=69744
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #10 variable-ref ref=d value=–6 offset=69790
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #11 variable-ref ref=d value=–6 offset=69836
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #12 variable-ref ref=d value=–6 offset=69842
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]
- #13 variable-ref ref=p value=–2 offset=69888
  context: the vertex is at ([[slot]], [[slot]]) and the graph opens [[slot]]

## record-9 @ 74419

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | identify quadratic functions
- Counts: strings=170, variables=14, display=5, refs=38, slots=4, visibleChoices=4

```text
Which function is not quadratic? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a1 = 7  rule: `range(-9,9,1)`
- a2 = 6  rule: `range(-9,9,1)`
- p1 = –9  rule: `range(-9,9,1)`
- p2 = 9  rule: `range(-9,9,1)`
- q1 = 8  rule: `range(-9,9,1)`
- q2 = –9  rule: `range(-9,9,1)`
- sign_p1 = ?  rule: `if(p1<0,chr(45),chr(43))`
- sign_p2 = ?  rule: `if(p2<0,chr(45),chr(43))`
- sign_q1 = ?  rule: `if(q1<0,chr(45),chr(43))`
- sign_q2 = ?  rule: `if(q2<0,chr(45),chr(43))`
- p1_value = 9  rule: `abs(p1)`
- p2_value = 9  rule: `abs(p2)`
- q1_value = 8  rule: `abs(q1)`
- q2_value = 9  rule: `abs(q2)`

Inline slots:
- #1 variable-ref ref=a2 value=6 offset=76389
  context: [[slot]]
- #2 variable-ref ref=sign_p2 value=if(p2<0,chr(45),chr(43)) offset=76397
  context: [[slot]]
- #3 variable-ref ref=p2_value value=9 offset=76407
  context: [[slot]]
- #4 variable-ref ref=p1_value value=9 offset=76415
  context: [[slot]]

## record-10 @ 80410

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | vertex | axis of symmetry | y-intercept | x-intercept | direction of opening
- Counts: strings=226, variables=19, display=5, refs=38, slots=29, visibleChoices=4

```text
Identify the characteristics of this graph.[[slot]] vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]] vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]] vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]] vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]]
```

Choices:
- A. vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]]
- B. vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]]
- C. vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]]
- D. vertex: ([[slot]], [[slot]])axis of symmetry: [[slot]]y-intercept: [[slot]]x-intercepts: [[slot]] and [[slot]]opens [[slot]]

Variables:
- a = 0.5  rule: `range(-15,2,.1)`
- p = –5  rule: `range(-15,15,1)`
- q = –2  rule: `range(-15,15,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = 5  rule: `abs(p)`
- q_value = 2  rule: `abs(q)`
- p_dis1 = –5  rule: `-1*p_value`
- q_dis1 = –2  rule: `-1*q_value`
- a_dis1 = –0.5  rule: `-1*a`
- sign_dis_p = ?  rule: `if(p<0,chr(45),chr(43))`
- sign_dis_q = ?  rule: `if(q<0,chr(43),chr(45))`
- y_int = 10.5  rule: `a*p*p+q`
- x_int1 = –3  rule: `p+sqrt(-q/a)`
- x_int2 = –7  rule: `p-sqrt(-q/a)`
- direction = upward  rule: `if(a<0,"downward","upward")`
- direction_dis = downward  rule: `if(a>0,"downward","upward")`
- x_int1_dis = 3  rule: `-1*x_int1`
- x_int2_dis = 7  rule: `-1*x_int2`

Inline slots:
- #1 variable-ref ref=p value=–5 offset=83150
  context: Identify the characteristics of this graph. [[slot]]
- #2 variable-ref ref=q value=–2 offset=83176
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[
- #3 variable-ref ref=p value=–5 offset=83182
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] ope
- #4 variable-ref ref=q value=–2 offset=83224
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #5 variable-ref ref=y_int value=10.5 offset=83254
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #6 variable-ref ref=x_int1 value=–3 offset=83286
  context: rtex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #7 variable-ref ref=x_int2 value=–7 offset=83298
  context: ]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #8 variable-ref ref=direction_dis value=downward offset=83314
  context: xis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #9 variable-ref ref=q value=–2 offset=83340
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[
- #10 variable-ref ref=p value=–5 offset=83346
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] ope
- #11 variable-ref ref=q value=–2 offset=83388
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #12 variable-ref ref=y_int value=10.5 offset=83418
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #13 variable-ref ref=x_int1 value=–3 offset=83450
  context: rtex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #14 variable-ref ref=x_int2 value=–7 offset=83462
  context: ]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #15 variable-ref ref=direction value=upward offset=83478
  context: xis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #16 variable-ref ref=p value=–5 offset=83506
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[
- #17 variable-ref ref=q value=–2 offset=83512
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] ope
- #18 variable-ref ref=p value=–5 offset=83554
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #19 variable-ref ref=y_int value=10.5 offset=83584
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #20 variable-ref ref=x_int1 value=–3 offset=83616
  context: rtex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #21 variable-ref ref=x_int2 value=–7 offset=83628
  context: ]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #22 variable-ref ref=direction value=upward offset=83644
  context: xis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #23 variable-ref ref=p value=–5 offset=83670
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[
- #24 variable-ref ref=q value=–2 offset=83676
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] ope
- #25 variable-ref ref=q value=–2 offset=83718
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #26 variable-ref ref=y_int value=10.5 offset=83748
  context: vertex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #27 variable-ref ref=x_int1_dis value=3 offset=83780
  context: rtex: ([[slot]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #28 variable-ref ref=x_int2_dis value=7 offset=83792
  context: ]], [[slot]]) axis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]
- #29 variable-ref ref=direction_dis value=downward offset=83808
  context: xis of symmetry: [[slot]] y-intercept: [[slot]] x-intercepts: [[slot]] and [[slot]] opens [[slot]]

## record-11 @ 95108

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=238, variables=25, display=5, refs=49, slots=5, visibleChoices=4

```text
What is [[slot]] written in standard form? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –2  rule: `range(-5,5,1)`
- b = 4  rule: `range(-5,5,1)`
- c = 6  rule: `range(-15,15,1)`
- d = –14  rule: `range(-15,15,1)`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- sign_d = ?  rule: `if(d<0,chr(45),chr(43))`
- c_value = 6  rule: `abs(c)`
- d_value = 14  rule: `abs(d)`
- A_ANS = –8  rule: `a*b`
- B_ANS = –52  rule: `-1*(b*c+a*d)`
- C_ANS = –84  rule: `c*d`
- sign_B_ANS = ?  rule: `if(B_ANS<0,chr(43),chr(45))`
- sign_C_ANS = ?  rule: `if(C_ANS<0,chr(45),chr(43))`
- B_VALUE = 52  rule: `abs(B_ANS)`
- CONSTANT = 84  rule: `abs(C_ANS)`
- a_dis1 = 2  rule: `a+b`
- c_dis1 = –8  rule: `c+d`
- c_dis1_value = 8  rule: `abs(c_dis1)`
- sign_c_dis1 = ?  rule: `if(c_dis1<1,chr(45),chr(43))`
- a_dis2 = –8  rule: `a*b`
- c_dis2 = –84  rule: `c*d`
- c_dis2_value = 84  rule: `abs(c_dis2)`
- sign_c_dis2 = ?  rule: `if(c_dis2<0,chr(45),chr(43))`
- B_ANS_dis = 28  rule: `abs(a*d)`

Inline slots:
- #1 variable-ref ref=a value=–2 offset=98060
  context: What is [[slot]] written in standard form?
- #2 variable-ref ref=sign_c value=if(c<0,chr(45),chr(43)) offset=98122
  context: [[slot]]
- #3 variable-ref ref=c_value value=6 offset=98130
  context: [[slot]]
- #4 variable-ref ref=b value=4 offset=98140
  context: [[slot]]
- #5 variable-ref ref=sign_d value=if(d<0,chr(45),chr(43)) offset=98148
  context: [[slot]]

## record-12 @ 102944

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | vertex
- Counts: strings=123, variables=10, display=5, refs=21, slots=9, visibleChoices=5

```text
What are the coordinates of the vertex of the quadratic function [[slot]]? ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]]) ([[slot]], [[slot]])
```

Choices:
- A. ([[slot]], [[slot]])
- B. ([[slot]], [[slot]])
- C. ([[slot]], [[slot]])
- D. ([[slot]], [[slot]])
- G. a

Variables:
- a = 4  rule: `range(-9,9,1)`
- b = 8  rule: `range(-9,9,1)`
- c = –2  rule: `range(-9,9,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 8  rule: `abs(b)`
- c_value = 2  rule: `abs(c)`
- x_coord = –1  rule: `-1*b/(2*a)`
- y_coord = –6  rule: `((b*b)/(4*a))-((b*b)/(2*a))+c`
- k = ?  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=a value=4 offset=104566
  context: What are the coordinates of the vertex of the quadratic function [[slot]]?
- #2 variable-ref ref=c value=–2 offset=104580
  context: ([[slot]], [[slot]])
- #3 variable-ref ref=a value=4 offset=104586
  context: ([[slot]], [[slot]])
- #4 variable-ref ref=sign_b value=if(b<0,chr(45),chr(43)) offset=104598
  context: ([[slot]], [[slot]])
- #5 variable-ref ref=b_value value=8 offset=104604
  context: ([[slot]], [[slot]])
- #6 variable-ref ref=sign_c value=if(c<0,chr(45),chr(43)) offset=104618
  context: ([[slot]], [[slot]])
- #7 variable-ref ref=c_value value=2 offset=104624
  context: ([[slot]], [[slot]])
- #8 variable-ref ref=y_coord value=–6 offset=104636
  context: ([[slot]], [[slot]])
- #9 variable-ref ref=x_coord value=–1 offset=104642
  context: ([[slot]], [[slot]])

## record-13 @ 107921

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=155, variables=15, display=5, refs=31, slots=5, visibleChoices=4

```text
What is the function [[slot]] written in standard form? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 2 4 5 6 8 9

Variables:
- a = 2  rule: `range(-9,9,1)`
- p = 4  rule: `range(-9,9,1)`
- q = –2  rule: `range(-9,9,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = 4  rule: `abs(p)`
- q_value = 2  rule: `abs(q)`
- ANS_B = –16  rule: `-2*a*p`
- ANS_C = 30  rule: `a*p*p+q`
- sign_ANS_B = ?  rule: `if(ANS_B<0,chr(45),chr(43))`
- sign_ANS_C = ?  rule: `if(ANS_C<0,chr(45),chr(43))`
- ANS_B_value = 16  rule: `abs(ANS_B)`
- ANS_C_value = 30  rule: `abs(ANS_C)`
- B_dis1 = 8  rule: `abs(a*p)`
- C_dis1 = 34  rule: `abs(a*p*p-q)`

Inline slots:
- #1 variable-ref ref=a value=2 offset=109861
  context: What is the function [[slot]] written in standard form?
- #2 variable-ref ref=sign_p value=if(p<0,chr(43),chr(45)) offset=109923
  context: [[slot]]
- #3 variable-ref ref=p_value value=4 offset=109931
  context: [[slot]]
- #4 variable-ref ref=sign_q value=if(q<0,chr(45),chr(43)) offset=109941
  context: [[slot]]
- #5 variable-ref ref=q_value value=2 offset=109949
  context: [[slot]]

## record-14 @ 113547

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=162, variables=8, display=5, refs=33, slots=5, visibleChoices=4

```text
What is the function [[slot]] written in standard form? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 2 4 5 6 8 9

Variables:
- q = 2  rule: `range(-9,9,1)`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 2  rule: `abs(q)`
- ANS_B = 4  rule: `2*q`
- ANS_C = 4  rule: `q*q`
- sign_ANS_B = ?  rule: `if(ANS_B<0,chr(45),chr(43))`
- ANS_B_value = 4  rule: `abs(ANS_B)`
- sign_dis1 = [[slot]]  rule: `if(q<0,chr(43),chr(45))`

Inline slots:
- #1 variable-ref ref=sign_q value=if(q<0,chr(45),chr(43)) offset=114679
  context: What is the function [[slot]] written in standard form?
- #2 variable-ref ref=q_value value=2 offset=114741
  context: [[slot]]
- #3 variable-ref ref=sign_ANS_B value=if(ANS_B<0,chr(45),chr(43)) offset=114749
  context: [[slot]]
- #4 variable-ref ref=ANS_B_value value=4 offset=114759
  context: [[slot]]
- #5 variable-ref ref=ANS_C value=4 offset=114767
  context: [[slot]]

## record-15 @ 119130

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | graph
- Counts: strings=137, variables=6, display=5, refs=32, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the quadratic function with the following characteristics: x-intercepts at [[slot]] and [[slot]][[slot]] of [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- graph = ?  rule: `[[slot]]`
- x1 = 8  rule: `range(-12,12,1)`
- x2 = 10  rule: `range(-12,12,1)`
- a = –1  rule: `range(-1,1,1)`
- max_or_min = maximum  rule: `if(a=1,"minimum","maximum")`
- vertex_y = 1  rule: `a*(((x1+x2)/2)-x1)*(((x1+x2)/2)-x2)`

Inline slots:
- #1 variable-ref ref=x1 value=8 offset=120424
  context: ph represents the quadratic function with the following characteristics: x-intercepts at [[slot]] and [[slot]] [[slot]] of [[slot]]
- #2 variable-ref ref=x2 value=10 offset=120436
  context: the quadratic function with the following characteristics: x-intercepts at [[slot]] and [[slot]] [[slot]] of [[slot]]
- #3 variable-ref ref=max_or_min value=maximum offset=120440
  context: ratic function with the following characteristics: x-intercepts at [[slot]] and [[slot]] [[slot]] of [[slot]]
- #4 variable-ref ref=vertex_y value=1 offset=120450
  context: on with the following characteristics: x-intercepts at [[slot]] and [[slot]] [[slot]] of [[slot]]
- #5 unknown-object ref=- value=- offset=120460
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=120468
  context: [[slot]]
- #7 unknown-object ref=- value=- offset=120478
  context: [[slot]]
- #8 unknown-object ref=- value=- offset=120486
  context: [[slot]]

## record-16 @ 140354

- Metadata: Difficult | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | determine equations from two points
- Counts: strings=171, variables=11, display=5, refs=45, slots=11, visibleChoices=4

```text
If the points [[slot]] and [[slot]] are on the graph of the quadratic function [[slot]], what are the values of b and c? [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]]
```

Choices:
- A. [[slot]] and [[slot]]
- B. [[slot]] and [[slot]]
- C. [[slot]] and [[slot]]
- D. [[slot]] and [[slot]]

Variables:
- a = 7  rule: `range(-9,9,1)`
- b = –4  rule: `range(-9,9,1)`
- c = –7  rule: `range(-9,9,1)`
- x1 = –1  rule: `range(-9,9,1)`
- x2 = 2  rule: `range(-9,9,1)`
- y1 = 4  rule: `a*x1*x1+b*x1+c`
- y2 = 13  rule: `a*x2*x2+b*x2+c`
- b_dis1 = –3  rule: `x1-x2`
- c_dis1 = –9  rule: `y1-y2`
- b_dis2 = 3  rule: `-1*b_dis1`
- c_dis2 = 9  rule: `-1*c_dis1`

Inline slots:
- #1 variable-ref ref=b value=–4 offset=141942
  context: If the points [[slot]] and [[slot]] are on the graph of the quadratic function [[slot]], what are the values of
- #2 variable-ref ref=b value=–4 offset=141954
  context: If the points [[slot]] and [[slot]] are on the graph of the quadratic function [[slot]], what are the values of b and c?
- #3 variable-ref ref=x1 value=–1 offset=142044
  context: If the points [[slot]] and [[slot]] are on the graph of the quadratic function [[slot]], what are the values of b and c?
- #4 variable-ref ref=y1 value=4 offset=142120
  context: [[slot]] and [[slot]]
- #5 variable-ref ref=b value=–4 offset=142132
  context: [[slot]] and [[slot]]
- #6 variable-ref ref=b value=–4 offset=142140
  context: [[slot]] and [[slot]]
- #7 variable-ref ref=x2 value=2 offset=142152
  context: [[slot]] and [[slot]]
- #8 variable-ref ref=y2 value=13 offset=142162
  context: [[slot]] and [[slot]]
- #9 variable-ref ref=a value=7 offset=142174
  context: [[slot]] and [[slot]]
- #10 variable-ref ref=c value=–7 offset=142182
  context: [[slot]] and [[slot]]
- #11 variable-ref ref=b_dis1 value=–3 offset=142194
  context: [[slot]] and [[slot]]

## record-17 @ 147035

- Metadata: Difficult | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | modelling data
- Counts: strings=203, variables=26, display=19, refs=32, slots=15, visibleChoices=4

```text
The table shows the path of an extraterrestrial missile, where x is the horizontal distance, in metres, from the launch pad and h is the height, in metres, of the missile above the launch pad. Horizontal distance, x Height, h [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] What quadratic equation can be used to model the data set? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –0.4  rule: `range(-.5,-.1,.1)`
- b = 5  rule: `range(1,9,1)`
- c = 4  rule: `range(1,4,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 5  rule: `abs(b)`
- c_value = 4  rule: `abs(c)`
- a_dis1 = 0.4  rule: `-1*a`
- b_dis1 = 2.5  rule: `b_value/2`
- c_dis1 = 2  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- x1 = 0  rule: `0`
- x2 = 1  rule: `1`
- x3 = 2  rule: `2`
- x4 = 3  rule: `int(x7*.3)`
- x5 = 6  rule: `int(x7*.5)`
- x6 = 9  rule: `int(x7*.75)`
- x7 = 13  rule: `int((-b-sqrt(b*b-4*a*c))/(2*a))`
- h1 = 4.0  rule: `a*x1*x1+b*x1+c`
- h2 = 8.6  rule: `a*x2*x2+b*x2+c`
- h3 = 12.4  rule: `a*x3*x3+b*x3+c`
- h4 = 15.4  rule: `a*x4*x4+b*x4+c`
- h5 = 19.6  rule: `a*x5*x5+b*x5+c`

Inline slots:
- #1 variable-ref ref=h1 value=4.0 offset=150075
  context: [[slot]]
- #2 variable-ref ref=h2 value=8.6 offset=150085
  context: [[slot]]
- #3 variable-ref ref=h3 value=12.4 offset=150095
  context: [[slot]]
- #4 variable-ref ref=x4 value=3 offset=150101
  context: [[slot]]
- #5 variable-ref ref=h4 value=15.4 offset=150105
  context: [[slot]]
- #6 variable-ref ref=x5 value=6 offset=150111
  context: [[slot]]
- #7 variable-ref ref=h5 value=19.6 offset=150115
  context: [[slot]]
- #8 variable-ref ref=x6 value=9 offset=150121
  context: [[slot]]
- #9 variable-ref ref=h6 value=16.6 offset=150125
  context: [[slot]]
- #10 variable-ref ref=x7 value=13 offset=150131
  context: [[slot]]
- #11 variable-ref ref=h7 value=1.4 offset=150135
  context: [[slot]]
- #12 variable-ref ref=a value=–0.4 offset=150267
  context: [[slot]]
- #13 variable-ref ref=sign_b value=if(b<0,chr(45),chr(43)) offset=150275
  context: [[slot]]
- #14 variable-ref ref=b_dis1 value=2.5 offset=150285
  context: [[slot]]
- #15 variable-ref ref=sign_c value=if(c<0,chr(45),chr(43)) offset=150293
  context: [[slot]]

## record-18 @ 156621

- Metadata: Easy | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=201, variables=20, display=5, refs=42, slots=5, visibleChoices=4

```text
What is the equation of the quadratic function [[slot]] in vertex form? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- b = 24  rule: `range(-50,50,1)`
- c = 29  rule: `range(-50,50,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 24  rule: `abs(b)`
- c_value = 29  rule: `abs(c)`
- b_dis1 = 12  rule: `b_value/2`
- c_dis1 = 14.5  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- p = 12  rule: `b/2`
- q = –115  rule: `-(pow(b,2)/(4))+c`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 115  rule: `abs(q)`
- sign_p = ?  rule: `if(p<0,chr(45),chr(43))`
- p_value = 12  rule: `abs(p)`
- q_dis1 = 173  rule: `pow((b/2),2)+c`
- sign_q_dis = ?  rule: `if(q>0,chr(45),chr(43))`
- sign_p_dis = ?  rule: `if(p>0,chr(45),chr(43))`
- q_value_dis1 = 173  rule: `abs(q_dis1)`

Inline slots:
- #1 variable-ref ref=sign_b value=if(b<0,chr(45),chr(43)) offset=159009
  context: What is the equation of the quadratic function [[slot]] in vertex form?
- #2 variable-ref ref=b_value value=24 offset=159051
  context: [[slot]]
- #3 variable-ref ref=sign_c value=if(c<0,chr(45),chr(43)) offset=159059
  context: [[slot]]
- #4 variable-ref ref=c_value value=29 offset=159069
  context: [[slot]]
- #5 variable-ref ref=sign_p value=if(p<0,chr(45),chr(43)) offset=159077
  context: [[slot]]

## record-19 @ 163489

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=227, variables=22, display=5, refs=52, slots=5, visibleChoices=4

```text
What is the equation of the quadratic function [[slot]] in vertex form? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = [[slot]]  rule: `range(-5,5,1)`
- b = – 26  rule: `range(-50,50,1)`
- c = + 41  rule: `range(-50,50,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 26  rule: `abs(b)`
- c_value = 41  rule: `abs(c)`
- b_dis1 = 13  rule: `b_value/2`
- c_dis1 = 20.5  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- p = – 13  rule: `b/(2*a)`
- q = – 128  rule: `-(pow(b,2)/(4*a))+c`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 128  rule: `abs(q)`
- sign_p = ?  rule: `if(p<0,chr(45),chr(43))`
- p_value = 13  rule: `abs(p)`
- q_dis1 = 210  rule: `pow((b/(2*a)),2)+c`
- sign_q_dis = ?  rule: `if(q>0,chr(45),chr(43))`
- sign_p_dis = ?  rule: `if(p>0,chr(45),chr(43))`
- q_value_dis1 = 210  rule: `abs(q_dis1)`
- e = –  rule: `-a`

Inline slots:
- #1 variable-ref ref=a value=[[slot]] offset=166183
  context: What is the equation of the quadratic function [[slot]] in vertex form?
- #2 variable-ref ref=b value=– 26 offset=166225
  context: [[slot]]
- #3 variable-ref ref=c value=+ 41 offset=166233
  context: [[slot]]
- #4 variable-ref ref=e value=– offset=166243
  context: [[slot]]
- #5 variable-ref ref=sign_p_dis value=if(p>0,chr(45),chr(43)) offset=166251
  context: [[slot]]

## record-20 @ 170892

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | vertex to standard form
- Counts: strings=174, variables=20, display=5, refs=33, slots=5, visibleChoices=4

```text
Which quadratic function in standard form represents [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 3  rule: `range(-5,5,1)`
- b = –6  rule: `range(-50,50,1)`
- c = –22  rule: `range(-50,50,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 6  rule: `abs(b)`
- c_value = 22  rule: `abs(c)`
- b_dis1 = 3  rule: `b_value/2`
- c_dis1 = 11  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- p = –1  rule: `b/(2*a)`
- q = –25  rule: `-(pow(b,2)/(4*a))+c`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 25  rule: `abs(q)`
- sign_p = ?  rule: `if(p<0,chr(45),chr(43))`
- p_value = 1  rule: `abs(p)`
- q_dis1 = –21  rule: `pow((b/(2*a)),2)+c`
- sign_q_dis = ?  rule: `if(q>0,chr(45),chr(43))`
- sign_p_dis = ?  rule: `if(p>0,chr(45),chr(43))`

Inline slots:
- #1 variable-ref ref=a value=3 offset=173366
  context: Which quadratic function in standard form represents [[slot]]?
- #2 variable-ref ref=sign_p value=if(p<0,chr(45),chr(43)) offset=173378
  context: [[slot]]
- #3 variable-ref ref=p_value value=1 offset=173386
  context: [[slot]]
- #4 variable-ref ref=sign_q value=if(q<0,chr(45),chr(43)) offset=173396
  context: [[slot]]
- #5 variable-ref ref=q_value value=25 offset=173404
  context: [[slot]]

## record-21 @ 177098

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | max/min
- Counts: strings=216, variables=20, display=5, refs=61, slots=9, visibleChoices=4

```text
State whether the function [[slot]] has a maximum or minimum value and identify the coordinates of the vertex. [[slot]] at [[slot]] [[slot]] at [[slot]] [[slot]] at [[slot]] [[slot]] at [[slot]]
```

Choices:
- A. [[slot]] at [[slot]]
- B. [[slot]] at [[slot]]
- C. [[slot]] at [[slot]]
- D. [[slot]] at [[slot]]

Variables:
- a = 4  rule: `range(-5,5,1)`
- b = –36  rule: `range(-50,50,1)`
- c = –43  rule: `range(-50,50,1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 36  rule: `abs(b)`
- c_value = 43  rule: `abs(c)`
- b_dis1 = 18  rule: `b_value/2`
- c_dis1 = 21.5  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- p = –4.5  rule: `b/(2*a)`
- q = –124  rule: `-(pow(b,2)/(4*a))+c`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 124  rule: `abs(q)`
- sign_p = ?  rule: `if(p>0,chr(45),chr(43))`
- p_value = 4.5  rule: `-1*p`
- q_dis1 = –22.75  rule: `pow((b/(2*a)),2)+c`
- Direction = minimum  rule: `if(a<0,"maximum","minimum")`
- dis_Direction = maximum  rule: `if(a>0,"maximum","minimum")`

Inline slots:
- #1 variable-ref ref=p value=–4.5 offset=179552
  context: State whether the function [[slot]] has a maximum or minimum value and identify the coordinates of the vertex.
- #2 variable-ref ref=a value=4 offset=179712
  context: [[slot]] at [[slot]]
- #3 variable-ref ref=sign_b value=if(b<0,chr(45),chr(43)) offset=179722
  context: [[slot]] at [[slot]]
- #4 variable-ref ref=b_value value=36 offset=179730
  context: [[slot]] at [[slot]]
- #5 variable-ref ref=sign_c value=if(c<0,chr(45),chr(43)) offset=179740
  context: [[slot]] at [[slot]]
- #6 variable-ref ref=c_value value=43 offset=179750
  context: [[slot]] at [[slot]]
- #7 variable-ref ref=dis_Direction value=maximum offset=179760
  context: [[slot]] at [[slot]]
- #8 variable-ref ref=p_value value=4.5 offset=179768
  context: [[slot]] at [[slot]]
- #9 variable-ref ref=q value=–124 offset=179778
  context: [[slot]] at [[slot]]

## record-22 @ 184915

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | vertex | fraction
- Counts: strings=156, variables=22, display=5, refs=23, slots=5, visibleChoices=4

```text
The vertex of the quadratic function [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- m = –7  rule: `range(-8,8,1)`
- n = 9  rule: `range(2,9,1)`
- r_calc = –3  rule: `range(-9,9,1)`
- r = 3  rule: `abs(r_calc)`
- t_calc = –1  rule: `range(-9,9,1)`
- t = 1  rule: `abs(t_calc)`
- s = 18  rule: `2*n`
- u = 81  rule: `n*n`
- a = -7/9  rule: `fracs(m,n)`
- b = 1/6  rule: `fracs(r,s)`
- c = 1/81  rule: `fracs(t,u)`
- sign_b = ?  rule: `if((r_calc/s)<0,chr(45),chr(43))`
- sign_c = ?  rule: `if((t_calc/u)<0,chr(45),chr(43))`
- p_denom = 28  rule: `-4*m`
- q_num = 31  rule: `-1*n*r_calc*r_calc+16*m*t_calc`
- q_denom = –9072  rule: `16*m*n*n`
- p = -3/28  rule: `fracs(r_calc,p_denom)`
- q = -31/9072  rule: `fracs(q_num,q_denom)`
- q_num_dis = –31  rule: `-1*q_num`
- p_denom_dis = –28  rule: `-1*p_denom`
- p_dis = 3/28  rule: `fracs(r_calc,p_denom_dis)`
- q_dis = 31/9072  rule: `fracs(q_num_dis,q_denom)`

Inline slots:
- #1 variable-ref ref=a value=-7/9 offset=187387
  context: The vertex of the quadratic function [[slot]] is
- #2 variable-ref ref=sign_b value=if((r_calc/s)<0,chr(45),chr(43)) offset=187403
  context: [[slot]]
- #3 variable-ref ref=b value=1/6 offset=187411
  context: [[slot]]
- #4 variable-ref ref=sign_c value=if((t_calc/u)<0,chr(45),chr(43)) offset=187421
  context: [[slot]]
- #5 variable-ref ref=c value=1/81 offset=187429
  context: [[slot]]

## record-23 @ 190388

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=189, variables=25, display=5, refs=34, slots=8, visibleChoices=4

```text
What is the vertex form of [[slot]]? [[slot]][[slot]][[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]] [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- m = 2  rule: `range(-8,8,1)`
- n = 8  rule: `range(2,9,1)`
- r_calc = 1  rule: `range(-9,9,1)`
- r = 1  rule: `abs(r_calc)`
- t_calc = –1  rule: `range(-9,9,1)`
- t = 1  rule: `abs(t_calc)`
- s = 16  rule: `2*n`
- u = 64  rule: `n*n`
- a = 1/4  rule: `fracs(m,n)`
- b = 1/16  rule: `fracs(r,s)`
- c = 1/64  rule: `fracs(t,u)`
- sign_b = ?  rule: `if((r_calc/s)<0,chr(45),chr(43))`
- sign_c = ?  rule: `if((t_calc/u)<0,chr(45),chr(43))`
- p_denom = –8  rule: `-4*m`
- q_num = –40  rule: `-1*n*r_calc*r_calc+16*m*t_calc`
- q_denom = 2048  rule: `16*m*n*n`
- p_denom_display = 8  rule: `abs(p_denom)`
- q_num_display = 40  rule: `abs(q_num)`
- q_denom_display = 2048  rule: `abs(q_denom)`
- sign_p = #  rule: `if((r_calc/p_denom)<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q_num/q_denom<0,chr(45),chr(43))`
- p = 1/8  rule: `fracs(r,p_denom_display)`
- q = 5/256  rule: `fracs(q_num_display,q_denom_display)`
- sign_p_dis = #  rule: `if((r_calc/p_denom)>0,chr(43),chr(45))`

Inline slots:
- #1 variable-ref ref=a value=1/4 offset=193326
  context: What is the vertex form of [[slot]] ?
- #2 variable-ref ref=sign_b value=if((r_calc/s)<0,chr(45),chr(43)) offset=193338
  context: [[slot]][[slot]][[slot]] [[slot]]
- #3 variable-ref ref=b value=1/16 offset=193340
  context: [[slot]][[slot]][[slot]] [[slot]]
- #4 variable-ref ref=sign_c value=if((t_calc/u)<0,chr(45),chr(43)) offset=193342
  context: [[slot]][[slot]][[slot]] [[slot]]
- #5 variable-ref ref=c value=1/64 offset=193346
  context: [[slot]][[slot]][[slot]] [[slot]]
- #6 variable-ref ref=a value=1/4 offset=193358
  context: [[slot]]
- #7 variable-ref ref=sign_p value=# offset=193368
  context: [[slot]]
- #8 variable-ref ref=p value=1/8 offset=193376
  context: [[slot]]

## record-24 @ 197404

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=153, variables=21, display=5, refs=30, slots=5, visibleChoices=4

```text
Convert [[slot]] to vertex form. Round coefficients to two decimal places, if necessary. [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –2.5  rule: `range(-5,5,.1)`
- b = –36.7  rule: `range(-50,50,.1)`
- c = –5.9  rule: `range(-50,50,.1)`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 36.7  rule: `abs(b)`
- c_value = 5.9  rule: `abs(c)`
- b_dis1 = 18.35  rule: `b_value/2`
- c_dis1 = 2.95  rule: `c_value/2`
- sign_b_dis1 = ?  rule: `if(b>0,chr(45),chr(43))`
- sign_c_dis1 = ?  rule: `if(c>0,chr(45),chr(43))`
- p = 7.34  rule: `b/(2*a)`
- q = 128.79  rule: `-(pow(b,2)/(4*a))+c`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- q_value = 128.79  rule: `abs(q)`
- sign_p = ?  rule: `if(p<0,chr(45),chr(43))`
- p_value = 7.34  rule: `abs(p)`
- q_dis1 = 47.98  rule: `pow((b/(2*a)),2)+c`
- sign_q_dis = ?  rule: `if(q>0,chr(45),chr(43))`
- sign_p_dis = ?  rule: `if(p>0,chr(45),chr(43))`
- q_value_dis1 = 47.98  rule: `abs(q_dis1)`

Inline slots:
- #1 variable-ref ref=b value=–36.7 offset=199864
  context: Convert [[slot]] to vertex form. Round coefficients to two decimal places, if necessary.
- #2 variable-ref ref=b value=–36.7 offset=200018
  context: [[slot]]
- #3 variable-ref ref=a value=–2.5 offset=200026
  context: [[slot]]
- #4 variable-ref ref=sign_b value=if(b<0,chr(45),chr(43)) offset=200036
  context: [[slot]]
- #5 variable-ref ref=b_value value=36.7 offset=200044
  context: [[slot]]

## record-25 @ 203365

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | axis of symmetry
- Counts: strings=180, variables=27, display=5, refs=16, slots=5, visibleChoices=4

```text
What is the axis of symmetry for the quadratic function [[slot]]? x = [[slot]] x = [[slot]] x = [[slot]] x = [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. x = [[slot]] 8 9

Variables:
- m = –1  rule: `range(-8,8,1)`
- n = 3  rule: `range(2,9,1)`
- r_calc = –3  rule: `range(-9,9,1)`
- r = 3  rule: `abs(r_calc)`
- t_calc = –9  rule: `range(-9,9,1)`
- t = 9  rule: `abs(t_calc)`
- s = 6  rule: `2*n`
- u = 9  rule: `n*n`
- a = -1/3  rule: `fracs(m,n)`
- b = 1/2  rule: `fracs(r,s)`
- c = 1  rule: `fracs(t,u)`
- sign_b = ?  rule: `if((r_calc/s)<0,chr(45),chr(43))`
- sign_c = ?  rule: `if((t_calc/u)<0,chr(45),chr(43))`
- p_denom = 4  rule: `-4*m`
- q_num = 117  rule: `-1*n*r_calc*r_calc+16*m*t_calc`
- q_denom = –144  rule: `16*m*n*n`
- p_denom_display = 4  rule: `abs(p_denom)`
- q_num_display = 117  rule: `abs(q_num)`
- q_denom_display = 144  rule: `abs(q_denom)`
- sign_p = #  rule: `if((r_calc/p_denom)<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q_num/q_denom<0,chr(45),chr(43))`
- p = -3/4  rule: `fracs(r_calc,p_denom)`
- q = -13/16  rule: `fracs(q_num,q_denom)`
- r_calc_di = 3  rule: `-1*r_calc`

Inline slots:
- #1 variable-ref ref=a value=-1/3 offset=206425
  context: What is the axis of symmetry for the quadratic function [[slot]]?
- #2 variable-ref ref=sign_b value=if((r_calc/s)<0,chr(45),chr(43)) offset=206445
  context: x = [[slot]]
- #3 variable-ref ref=b value=1/2 offset=206461
  context: x = [[slot]]
- #4 variable-ref ref=sign_c value=if((t_calc/u)<0,chr(45),chr(43)) offset=206479
  context: x = [[slot]]
- #5 variable-ref ref=c value=1 offset=206495
  context: x = [[slot]]

## record-26 @ 209558

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | direction of opening
- Counts: strings=49, variables=10, display=1, refs=4, slots=2, visibleChoices=0

```text
A quadratic function with vertex (0, [[slot]]) and [[slot]] x-intercepts will open _______________.
```

Variables:
- y = 1  rule: `range(-9,9,1)`
- Intercepts_List = no, two  rule: `list("no","two")`
- Which_intercept = 2  rule: `rand(2)`
- Intercepts = two  rule: `choose(Which_intercept,Intercepts_List)`
- two = ?  rule: `'`
- direction1 = upward  rule: `if(Intercepts="no","downward","upward")`
- upward = ?  rule: `'`
- direction2 = downward  rule: `if(Intercepts="no","upward","downward")`
- Direction = ?  rule: `if(y<0,direction1,direction2)`
- downward = ?  rule: `U`

Inline slots:
- #1 variable-ref ref=y value=1 offset=210782
  context: A quadratic function with vertex (0, [[slot]]) and [[slot]] x-intercepts will open _______________.
- #2 variable-ref ref=Intercepts value=two offset=210796
  context: A quadratic function with vertex (0, [[slot]]) and [[slot]] x-intercepts will open _______________.

## record-27 @ 212584

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form
- Counts: strings=82, variables=9, display=1, refs=18, slots=1, visibleChoices=0

```text
The quadratic function in vertex form that represents the graph shown below is ____________________. [[slot]]
```

Variables:
- a = –4  rule: `range(-10,10,1)`
- p = –3  rule: `range(-12,12,1)`
- q = –5  rule: `range(-12,12,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- value_p = 3  rule: `abs(p)`
- value_q = 5  rule: `abs(q)`
- p2 = –1  rule: `p+2`
- q2 = –21  rule: `a*pow((p2-p),2)+q`

Inline slots:
- #1 variable-ref ref=p value=–3 offset=214028
  context: function in vertex form that represents the graph shown below is ____________________ . [[slot]]

## record-28 @ 223722

- Metadata: Easy | Section 3.1 | Section 3.2 | RF 3 | RF 4 | Investigating Quadratic Functions in Vertex Form | Investigating Quadratic Functions in Standard Form | axis of symmetry | y-intercept | vertex
- Counts: strings=33, variables=0, display=4, refs=3, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("vertex","y-intercept","axis of symmetry") vertex, y-intercept, axis of symmetry y-intercept You can read the [[slot]] from a function written in _______________ form.
```

Choices:
- C. You can read the [[slot]] from a function written in _______________ form.

Inline slots:
- #1 math-object ref=- value=- offset=224912
  context: You can read the [[slot]] from a function written in _______________ form.

## record-29 @ 226506

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form | vertex to standard form
- Counts: strings=98, variables=23, display=1, refs=11, slots=2, visibleChoices=0

```text
The function [[slot]] and the function [[slot]] are _______________.
```

Variables:
- m = –6  rule: `range(-8,8,1)`
- n = 8  rule: `range(2,9,1)`
- r_calc = –3  rule: `range(-9,9,1)`
- r = 3  rule: `abs(r_calc)`
- t_calc = –3  rule: `range(-9,9,1)`
- t = 3  rule: `abs(t_calc)`
- s = 16  rule: `2*n`
- u = 64  rule: `n*n`
- a = -3/4  rule: `fracs(m,n)`
- b = 3/16  rule: `fracs(r,s)`
- c = 3/64  rule: `fracs(t,u)`
- sign_b = ?  rule: `if((r_calc/s)<0,chr(45),chr(43))`
- sign_c = ?  rule: `if((t_calc/u)<0,chr(45),chr(43))`
- p_denom = 24  rule: `-4*m`
- q_num = 216  rule: `-1*n*r_calc*r_calc+16*m*t_calc`
- q_denom = –6144  rule: `16*m*n*n`
- p_denom_display = 24  rule: `abs(p_denom)`
- q_num_display = 216  rule: `abs(q_num)`
- q_denom_display = 6144  rule: `abs(q_denom)`
- sign_p = #  rule: `if((r_calc/p_denom)<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q_num/q_denom<0,chr(45),chr(43))`
- p = 1/8  rule: `fracs(r,p_denom_display)`
- q = 9/256  rule: `fracs(q_num_display,q_denom_display)`

Inline slots:
- #1 variable-ref ref=a value=-3/4 offset=229118
  context: The function [[slot]] and the function [[slot]] are _______________.
- #2 variable-ref ref=sign_p value=# offset=229156
  context: The function [[slot]] and the function [[slot]] are _______________.

## record-30 @ 231010

- Metadata: Easy | Section 3.3 | RF 4 | Completing the Square | maximum | minimum
- Counts: strings=31, variables=1, display=2, refs=2, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref

```text
maximum, minimum Completing the square can be used to find the _______________ or [[slot]].
```

Choices:
- C. Completing the square can be used to find the _______________ or [[slot]].

Variables:
- max_min_list = ?  rule: `list("maximum","minimum")`

Inline slots:
- #1 unknown-object ref=- value=- offset=231862
  context: Completing the square can be used to find the _______________ or [[slot]].

## record-31 @ 233360

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=15, variables=0, display=1, refs=5, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=233598
  context: [[slot]]

## record-32 @ 234659

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=16, variables=0, display=1, refs=5, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=234897
  context: [[slot]]

## record-33 @ 235968

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form
- Counts: strings=15, variables=0, display=1, refs=2, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=236206
  context: [[slot]]

## record-34 @ 237282

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form
- Counts: strings=29, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=237518
  context: [[slot]]

## record-35 @ 238894

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form
- Counts: strings=29, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=239130
  context: [[slot]]

## record-36 @ 240508

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form
- Counts: strings=29, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=240744
  context: [[slot]]

## record-37 @ 242120

- Metadata: Easy | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex
- Counts: strings=72, variables=7, display=1, refs=17, slots=1, visibleChoices=0

```text
State the vertex of the function [[slot]].
```

Variables:
- a = –3  rule: `range(-9,9,1)`
- q = –3  rule: `range(-9,9,1)`
- p = 2  rule: `range(-9,9,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = 2  rule: `abs(p)`
- q_value = 3  rule: `abs(q)`

Inline slots:
- #1 variable-ref ref=a value=–3 offset=243124
  context: State the vertex of the function [[slot]].

## record-38 @ 245436

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form | graph
- Counts: strings=81, variables=7, display=1, refs=17, slots=2, visibleChoices=0

```text
Sketch the graph of the function [[slot]]. Label the vertex. [[slot]]
```

Variables:
- a = 9  rule: `range(-9,9,1)`
- q = –2  rule: `range(-9,9,1)`
- p = –4  rule: `range(-9,9,1)`
- sign_p = ?  rule: `if(p<0,chr(43),chr(45))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = 4  rule: `abs(p)`
- q_value = 2  rule: `abs(q)`

Inline slots:
- #1 variable-ref ref=a value=9 offset=246472
  context: Sketch the graph of the function [[slot]]. Label the vertex. [[slot]]
- #2 variable-ref ref=sign_p value=if(p<0,chr(43),chr(45)) offset=246516
  context: Sketch the graph of the function [[slot]]. Label the vertex. [[slot]]

## record-39 @ 257018

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex
- Counts: strings=16, variables=0, display=1, refs=0, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-post-font-refs, slots-but-no-algorithmic-variables

```text
The graph represents the revenue a company generates when it sells x units of a product. How many units should the company sell to generate the highest revenue, and what is the highest revenue? [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=257634
  context: hould the company sell to generate the highest revenue, and what is the highest revenue? [[slot]]

## record-40 @ 808992

- Metadata: Difficult | Section 3.1 | RF 4 | Investigating Quadratic Functions in Vertex Form | vertex form | intercept
- Counts: strings=51, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A tennis ball follows a path described by the function h(d) = [[slot]](d – 12)2 + 2, where h is the height of the ball above the court and d is the horizontal distance of the ball from the tennis player, both in metres. How high above court level did the tennis player hit the ball?
```

Inline slots:
- #1 math-object ref=- value=- offset=809380
  context: A tennis ball follows a path described by the function h(d) = [[slot]](d – 12)2 + 2, where h is the height of the ball above the court and d is the horizontal d

## record-41 @ 812327

- Metadata: Difficult | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | domain | range
- Counts: strings=76, variables=0, display=1, refs=21, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
An architect is using the graph to model an arch-shaped window, where h is the height of the window, in metres, and x is the horizontal position from the centre of the arch. Write the function in standard form represented by the graph and state the domain and range of the function. [[slot]]
```

Choices:
- G. t

Inline slots:
- #1 math-object ref=- value=- offset=813177
  context: n standard form represented by the graph and state the domain and range of the function. [[slot]]

## record-42 @ 821268

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | x-intercepts
- Counts: strings=59, variables=0, display=1, refs=12, slots=0, visibleChoices=0

```text
State the x-intercept(s) of the function y = 49x2 + 42x + 9.
```

## record-43 @ 824408

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | graph | vertex | x-intercepts
- Counts: strings=103, variables=11, display=1, refs=19, slots=2, visibleChoices=0

```text
Sketch the graph of the quadratic relation [[slot]]. Label the x-intercepts and the vertex.[[slot]]
```

Variables:
- a = –2  rule: `range(-5,5,1)`
- x1 = 1  rule: `range(-10,10,1)`
- x2 = 5  rule: `range(-10,10,1)`
- b = + 12  rule: `-1*a*(x2+x1)`
- c = – 10  rule: `a*x1*x2`
- x_vertex = 3  rule: `(x1+x2)/2`
- y_vertex = 8  rule: `a*x_vertex*x_vertex+b*x_vertex+c`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- b_value = 12  rule: `abs(b)`
- c_value = 10  rule: `abs(c)`

Inline slots:
- #1 variable-ref ref=a value=–2 offset=826030
  context: Sketch the graph of the quadratic relation [[slot]]. Label the x-intercepts and the vertex. [[slot]]
- #2 variable-ref ref=b value=+ 12 offset=826114
  context: etch the graph of the quadratic relation [[slot]]. Label the x-intercepts and the vertex. [[slot]]

## record-44 @ 840129

- Metadata: Average | Section 3.3 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | vertex
- Counts: strings=228, variables=0, display=2, refs=33, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Water spraying from a large fountain follows a path modelled by the function h(d) = [[slot]]d2 + 4d, for h 0, where h is the height of the water above the fountain jet and d is the horizontal distance of the water from the fountain jet, both in metres.a) Graph the function and use the graph to determine the maximum height of the fountain.b) What horizontal distance does the water travel from the fountain jet before it reaches the maximum height?[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=840559
  context: Water spraying from a large fountain follows a path modelled by the function h(d) = [[slot]]d2 + 4d, for h
- #2 unknown-object ref=- value=- offset=841283
  context: istance does the water travel from the fountain jet before it reaches the maximum height? [[slot]]

## record-45 @ 867593

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=142, variables=17, display=1, refs=41, slots=1, visibleChoices=0

```text
Express the quadratic function [[slot]] in vertex form.
```

Variables:
- a = –3  rule: `range(-5,5,1)`
- p = 2  rule: `range(-10,10,1)`
- q = 2  rule: `range(-10,10,1)`
- b = 12  rule: `-2*a*p`
- c = –10  rule: `a*p*p+q`
- sign_b = ?  rule: `if(b<0,chr(45),chr(43))`
- sign_c = ?  rule: `if(c<0,chr(45),chr(43))`
- sign_p = ?  rule: `if(p>0,chr(45),chr(43))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = – 2  rule: `-p`
- p_intermediate1 = – 4  rule: `b/a`
- q_intermediate1 = + 4  rule: `pow((p_intermediate1/2),2)`
- q_intermediate2 = + 12  rule: `a*q_int1_minus`
- q_value_inter2 = 12  rule: `abs(q_intermediate2)`
- sign_q_intermediate2 = ?  rule: `if(q_intermediate2>0,chr(45),chr(43))`
- n = – 4  rule: `b_value/a`
- q_int1_minus = – 4  rule: `-q_intermediate1`

Inline slots:
- #1 variable-ref ref=a value=–3 offset=869903
  context: Express the quadratic function [[slot]] in vertex form.

## record-46 @ 872973

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex to standard form | vertex
- Counts: strings=58, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Write the function y = –(x – 2)2 + 9 in standard form.b) Sketch the graph of the function. Use your answer to part a) to identify the y-intercept.[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=873553
  context: Sketch the graph of the function. Use your answer to part a) to identify the y-intercept. [[slot]]

## record-47 @ 884612

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | domain | range | vertex | vertex form
- Counts: strings=71, variables=0, display=7, refs=5, slots=0, visibleChoices=0

```text
A ball is launched from a 50-m cliff vertically upward on Jupiter. The table shows the height, h, in metres, of the ball above the surface at time, t, in seconds, after it was launched. 50 88 101 88 50 a) State the domain and range of the function modelled by the data.b) Estimate the vertex of the function.c) What is the approximate equation, in vertex form, that models this situation?
```

## record-48 @ 890486

- Metadata: Easy | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form | graph
- Counts: strings=71, variables=7, display=1, refs=18, slots=1, visibleChoices=0

```text
Write the equation of the quadratic function illustrated by the graph, in vertex form. [[slot]]
```

Variables:
- a = –3  rule: `range(-5,5,1)`
- p = – 5  rule: `range(-5,5,1)`
- q = + 5  rule: `range(-5,5,1)`
- sign_p = ?  rule: `if(p>0,chr(45),chr(43))`
- sign_q = ?  rule: `if(q<0,chr(45),chr(43))`
- p_value = + 5  rule: `-p`
- q_value = 5  rule: `abs(q)`

Inline slots:
- #1 variable-ref ref=a value=–3 offset=891732
  context: Write the equation of the quadratic function illustrated by the graph, in vertex form. [[slot]]

## record-49 @ 898064

- Metadata: Easy | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | axis of symmetry | domain | range | vertex
- Counts: strings=56, variables=0, display=1, refs=11, slots=0, visibleChoices=0

```text
Consider the function y = –2(x – 12)2 + 18.a) What is the axis of symmetry of the graph of the function.b) What is the vertex of the graph of the function?c) State the domain and range of the function.
```

## record-50 @ 903904

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form | vertex
- Counts: strings=41, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A store can increase its profit by increasing the price of the sweaters it sells. The relation between the income, R, and the dollar increase in the price per sweater, d, can be modelled by the equation [[slot]].a) What is the maximum possible income?b) What would the income be if the price per sweater were increased by $10?
```

Inline slots:
- #1 math-object ref=- value=- offset=904564
  context: , R, and the dollar increase in the price per sweater, d, can be modelled by the equation [[slot]]. a) What is the maximum possible income? b) What would the income be if the price per swe

## record-51 @ 907448

- Metadata: Average | Section 3.1 | RF 3 | Investigating Quadratic Functions in Vertex Form | vertex form | modelling
- Counts: strings=31, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
A bridge forms a parabolic arch. The span of the arch is 60 m and its centre is 10 m above either end.a) What equation models this situation?b) What is the height of the arch 15 m from either end of the bridge?
```

## record-52 @ 911629

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | x-intercepts | y-intercept
- Counts: strings=121, variables=0, display=1, refs=21, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of the function y = x2 + x – [[slot]]. Identify the x-intercepts and the y-intercept.
```

Inline slots:
- #1 math-object ref=- value=- offset=911991
  context: Sketch the graph of the function y = x2 + x – [[slot]]. Identify the x-intercepts and the y-intercept.

## record-53 @ 926550

- Metadata: Average | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | x-intercepts | y-intercept | vertex | axis of symmetry
- Counts: strings=59, variables=0, display=1, refs=12, slots=0, visibleChoices=0

```text
Given the function y = –x2 – 26x – 160,a) find the x-interceptsb) find the axis of symmetry and the vertex
```

## record-54 @ 930258

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | domain | range | intercept
- Counts: strings=99, variables=0, display=1, refs=28, slots=0, visibleChoices=0

```text
A baseball batter hits an infield fly ball. The height, h, in metres, of the baseball after t seconds is approximately modelled by the function h(t) = –5t2 + 4t + 1.a) State the domain and range of the function.b) What is the initial height of the ball?c) How long does it take for the ball to hit the ground?
```

## record-55 @ 936804

- Metadata: Easy | Section 3.2 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | modelling
- Counts: strings=39, variables=0, display=1, refs=3, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The wavelength, L, in metres, of an ocean wave is modelled by a quadratic relation of the form [[slot]], where T is the period, in seconds, and k is a constant.a) What is the value of k if a wave with wavelength 25 m has a period of 4.0 s?b) What is the wavelength, to the nearest metre, of a wave if its period is 6.5 s, assuming the wave has the same k-value as in part a)?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=937256
  context: avelength, L, in metres, of an ocean wave is modelled by a quadratic relation of the form [[slot]], where T is the period, in seconds, and k is a constant. a) What is the value of k if a w

## record-56 @ 940592

- Metadata: Easy | Section 3.3 | RF 4 | Investigating Quadratic Functions in Standard Form | standard form | modelling
- Counts: strings=105, variables=0, display=14, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The velocity, v, in millimetres per second, of a particle falling through water is a related to the diameter, d, in millimetres, of the particle. The relation can be modelled by a quadratic equation. The table shows the type of particle, its diameter, and its velocity while falling through water. d (mm) v (mm/s) 41920.0 Coarse sand 0.5 163.8 Fine sand 0.1 6.6 0.004 0.0 a) Graph the data and determine the equation that models this situation.b) What is the diameter of a particle that is falling at a velocity of 2620 mm/s? [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=943042
  context: [[slot]]

## record-57 @ 959158

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard form | modelling
- Counts: strings=61, variables=0, display=1, refs=14, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The Viking 1 spacecraft made a soft landing on Mars on July 20, 1976. Its height, h, in metres, t seconds before touchdown was modelled by the relation [[slot]].a) Graph the height against time.[[slot]]b) What was the height of the spacecraft 90 s before touchdown?
```

Inline slots:
- #1 diagram-object ref=- value=- offset=959672
  context: , 1976. Its height, h, in metres, t seconds before touchdown was modelled by the relation [[slot]]. a) Graph the height against time. [[slot]] b) What was the height of the spacecraft 90 s
- #2 diagram-object ref=- value=- offset=959746
  context: before touchdown was modelled by the relation [[slot]]. a) Graph the height against time. [[slot]] b) What was the height of the spacecraft 90 s before touchdown?

## record-58 @ 971037

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard form | modelling
- Counts: strings=49, variables=1, display=1, refs=8, slots=2, visibleChoices=0

```text
Graph the function for t [[slot]] 0 using technology.[[slot]] a) From the graph, the maximum height is about 6.5 m.b) It takes about 0.7 s to reach the maximum height.c) The t-intercept is approximately 1.8. It takes Nina about 1.8 s to enter the water.d) Substituting t = 0 into the equation, or reading from the graph at t = 0, h = 4. So, the board is 4 m above the water.
```

Variables:
- d = 4  rule: `2`

Inline slots:
- #1 variable-ref ref=d value=4 offset=972953
  context: Graph the function for t [[slot]] 0 using technology. [[slot]] a) From the graph, the maximum height is about 6.5 m. b) It
- #2 variable-ref ref=d value=4 offset=972997
  context: Graph the function for t [[slot]] 0 using technology. [[slot]] a) From the graph, the maximum height is about 6.5 m. b) It takes about 0.7 s to reach t

## record-59 @ 1053166

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form | x-intercepts | y-intercept
- Counts: strings=80, variables=0, display=1, refs=17, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A ball is thrown straight up from the edge of a cliff and falls to the ground below. The height, h, in metres, of the ball above the ground t seconds after being thrown is approximately modelled by the relation [[slot]].a) Determine the maximum height of the ball above the ground by writing the equation in vertex form.b) How long does it take for the ball to reach the maximum height?c) After how many seconds does the ball hit the ground?d) How high is the top of the cliff above the ground?[[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=1053856
  context: l above the ground t seconds after being thrown is approximately modelled by the relation [[slot]]. a) Determine the maximum height of the ball above the ground by writing the equation in
- #2 unknown-object ref=- value=- offset=1054418
  context: conds does the ball hit the ground? d) How high is the top of the cliff above the ground? [[slot]]

## record-60 @ 1068411

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form | vertex
- Counts: strings=61, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A pebble is thrown from a bridge into a river. Its height, h, in metres, above the river t seconds after it is released is modelled by the relation [[slot]].a) Use an algebraic method to determine the maximum height of the pebble over the river.b) How long does it take for the pebble to reach its maximum height?c) How high is the pebble above the river after 2.5 s?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1068935
  context: h, in metres, above the river t seconds after it is released is modelled by the relation [[slot]]. a) Use an algebraic method to determine the maximum height of the pebble over the river.

## record-61 @ 1073013

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard to vertex form | vertex | x-intercepts
- Counts: strings=55, variables=0, display=1, refs=11, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A projectile is shot vertically into the air. Its height, h, in metres, after t seconds is approximately modelled by the relation [[slot]].a) What is the maximum height of the projectile?b) When does the projectile reach its maximum height?c) For how many seconds is the projectile in the air?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1073527
  context: air. Its height, h, in metres, after t seconds is approximately modelled by the relation [[slot]]. a) What is the maximum height of the projectile? b) When does the projectile reach its m

## record-62 @ 1077860

- Metadata: Difficult | Section 3.3 | RF 4 | Completing the Square | standard to vertex form | vertex | x-intercepts
- Counts: strings=111, variables=0, display=3, refs=21, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
On a forward somersault dive, Nina s height, h, in metres, above the water is approximately modelled by the relation [[slot]], where t is the time in seconds after she leaves the board.a) Find Nina s maximum height above the water.b) How long does it take her to reach the maximum height?c) How long is it before she enters the water?d) How high is the board above the water?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1078352
  context: s height, h, in metres, above the water is approximately modelled by the relation [[slot]], where t is the time in seconds after she leaves the board. a) Find Nina

## record-63 @ 1087594

- Metadata: Average | Section 3.3 | RF 4 | Completing the Square | standard to vertex form
- Counts: strings=211, variables=0, display=1, refs=34, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The quadratic relations [[slot]] and [[slot]] model the height, h, in metres, that a trampolinist can jump in t seconds. What can be said about the corresponding graphs?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1087848
  context: The quadratic relations [[slot]] and [[slot]] model the height, h, in metres, that a trampolinist can jump in t seconds. W
- #2 unknown-object ref=- value=- offset=1087860
  context: The quadratic relations [[slot]] and [[slot]] model the height, h, in metres, that a trampolinist can jump in t seconds. What can be sa

