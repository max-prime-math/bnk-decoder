# Record Inspection: Chapter 05.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 05.bnk`
- Inflated bytes: 641876
- Records: 60
- Inline slots: 235
- Slot classes: variable-ref=160, unknown-object=44, fixed-value=8, math-object=16, diagram-object=7

## record-1 @ 4628

- Metadata: Easy | Section 5.1 | T4 | Graphing Sine and Cosine Functions | graph | sinusoidal function
- Counts: strings=181, variables=7, display=9, refs=48, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which function, where x is in radians, is represented by the graph shown below? [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- function = 4  rule: `range(1,4)`
- ans = -cos  rule: `if(function=1,"sin",if(function=2,"cos",if(function=3,"-sin","-cos")))`
- dis1 = -sin  rule: `if(function=2,"sin",if(function=3,"cos",if(function=4,"-sin","-cos")))`
- dis2 = cos  rule: `if(function=3,"sin",if(function=4,"cos",if(function=1,"-sin","-cos")))`
- cos = ?  rule: `F`
- dis3 = sin  rule: `if(function=4,"sin",if(function=1,"cos",if(function=2,"-sin","-cos")))`
- sin = ?  rule: `3`

Inline slots:
- #1 variable-ref ref=ans value=-cos offset=5980
  context: Which function, where x is in radians, is represented by the graph shown below? [[slot]]
- #2 variable-ref ref=dis2 value=cos offset=5990
  context: [[slot]]
- #3 variable-ref ref=dis3 value=sin offset=6000
  context: [[slot]]
- #4 variable-ref ref=dis1 value=-sin offset=6012
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=6022
  context: [[slot]]

## record-2 @ 19502

- Metadata: Easy | Section 5.1 | T4 | Graphing Sine and Cosine Functions | range | sinusoidal function
- Counts: strings=150, variables=2, display=9, refs=34, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The range (in radians) of the graph of [[slot]] is A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- function = 2  rule: `range(1,2)`
- select_function = cos  rule: `if(function=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=select_function value=cos offset=20100
  context: The range (in radians) of the graph of [[slot]] is
- #2 unknown-object ref=- value=- offset=20116
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=20126
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=20138
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=20148
  context: [[slot]]

## record-3 @ 24685

- Metadata: Easy | Section 5.1 | T4 | Graphing Sine and Cosine Functions | period | sinusoidal function
- Counts: strings=171, variables=7, display=9, refs=35, slots=5, visibleChoices=4

```text
The period (in degrees) of the graph of [[slot]] is A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- function = 2  rule: `range(1,2)`
- select_function = cos  rule: `if(function=1,"sin","cos")`
- b = 4  rule: `range(1,10)`
- period = 90  rule: `360/b`
- dis1 = 180  rule: `2*period`
- dis2 = 45  rule: `period/2`
- dis3 = 270  rule: `360-period`

Inline slots:
- #1 variable-ref ref=select_function value=cos offset=25815
  context: The period (in degrees) of the graph of [[slot]] is
- #2 variable-ref ref=b value=4 offset=25831
  context: [[slot]]
- #3 variable-ref ref=dis3 value=270 offset=25841
  context: [[slot]]
- #4 variable-ref ref=period value=90 offset=25853
  context: [[slot]]
- #5 variable-ref ref=dis1 value=180 offset=25863
  context: [[slot]]

## record-4 @ 30265

- Metadata: Average | Section 5.1 | T4 | Graphing Sine and Cosine Functions | amplitude | period | sinusoidal function
- Counts: strings=275, variables=16, display=9, refs=87, slots=14, visibleChoices=5

```text
The amplitude and period (in [[slot]]) of [[slot]] are A. amplitude = [[slot]]period = [[slot]][[slot]] C. amplitude = [[slot]]period = [[slot]][[slot]] B. amplitude = [[slot]]period = [[slot]][[slot]] D. amplitude = [[slot]]period = [[slot]][[slot]]
```

Choices:
- A. amplitude = [[slot]]period = [[slot]][[slot]]
- B. amplitude = [[slot]]period = [[slot]][[slot]]
- C. amplitude = [[slot]]period = [[slot]][[slot]]
- D. amplitude = [[slot]]period = [[slot]][[slot]]
- F. d

Variables:
- a = –2  rule: `range(-5,5)`
- b = 5  rule: `range(1,5)`
- function = 1  rule: `range(1,2)`
- select_function = sin  rule: `if(function=1,"sin","cos")`
- angle_select = 1  rule: `range(1,2)`
- angle = degrees  rule: `choose(angle_select,"degrees","radians")`
- amp = 2  rule: `abs(a)`
- period_angle = 72  rule: `360/b`
- period_rad = 2/5  rule: `fracs(2,b)`
- degree = 1  rule: `if(angle_select=1,1,0)`
- radian = 0  rule: `if(angle_select=2,1,0)`
- dis_amp = 1/5  rule: `fracs(1,b)`
- dis_period_rad = 4/5  rule: `fracs(4,b)`
- dis_period_angle = 90  rule: `360/4`
- dis_amp1 = –2  rule: `-1*amp`
- dis_amp2 = -1/5  rule: `fracs(-1,b)`

Inline slots:
- #1 variable-ref ref=a value=–2 offset=32247
  context: The amplitude and period (in [[slot]]) of [[slot]] are
- #2 variable-ref ref=angle value=degrees offset=32259
  context: The amplitude and period (in [[slot]]) of [[slot]] are
- #3 variable-ref ref=a value=–2 offset=32301
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #4 variable-ref ref=select_function value=sin offset=32323
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #5 variable-ref ref=b value=5 offset=32325
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #6 variable-ref ref=dis_amp value=1/5 offset=32359
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #7 variable-ref ref=period_rad value=2/5 offset=32381
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #8 variable-ref ref=period_angle value=72 offset=32383
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #9 variable-ref ref=degree value=1 offset=32419
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #10 variable-ref ref=dis_amp2 value=-1/5 offset=32441
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #11 variable-ref ref=dis_period_rad value=4/5 offset=32443
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #12 variable-ref ref=dis_period_angle value=90 offset=32477
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #13 variable-ref ref=degree value=1 offset=32499
  context: amplitude = [[slot]] period = [[slot]][[slot]]
- #14 variable-ref ref=amp value=2 offset=32501
  context: amplitude = [[slot]] period = [[slot]][[slot]]

## record-5 @ 39960

- Metadata: Difficult | Section 5.1 | T4 | Graphing Sine and Cosine Functions | graph | amplitude | period | sinusoidal function
- Counts: strings=159, variables=10, display=11, refs=13, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which graph represents the function y = [[slot]] sin ([[slot]], where is in radians? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a_num = 3  rule: `range(-5,5)`
- a_denom = 5  rule: `range(-6,6)`
- a = 3/5  rule: `fracs(a_num,a_denom)`
- b_num = –5  rule: `range(-5,5)`
- b_denom = 5  rule: `range(-5,5)`
- b = -1  rule: `fracs(b_num,b_denom)`
- a_graph = 0.6  rule: `a_num/a_denom`
- b_graph = –1  rule: `b_num/b_denom`
- period = 6.28318530718  rule: `2*pi/abs(b_graph)`
- amp = 0.6  rule: `abs(a_graph)`

Inline slots:
- #1 variable-ref ref=a value=3/5 offset=41514
  context: Which graph represents the function y = [[slot]] sin ([[slot]]
- #2 variable-ref ref=b value=-1 offset=41528
  context: Which graph represents the function y = [[slot]] sin ([[slot]]
- #3 unknown-object ref=- value=- offset=41590
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=41600
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=41612
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=41622
  context: [[slot]]

## record-6 @ 61018

- Metadata: Difficult | Section 5.1 | T4 | Graphing Sine and Cosine Functions | graph | amplitude | period | sinusoidal function
- Counts: strings=157, variables=10, display=9, refs=21, slots=6, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
Which graph represents the function y = [[slot]]cos([[slot]]x), where x is in degrees? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. \

Variables:
- a_num = –3  rule: `range(-5,5)`
- a_denom = –4  rule: `range(-6,6)`
- a = 3/4  rule: `fracs(a_num,a_denom)`
- b_num = 4  rule: `range(-5,5)`
- b_denom = –3  rule: `range(-5,5)`
- b = -4/3  rule: `fracs(b_num,b_denom)`
- a_graph = 0.75  rule: `a_num/a_denom`
- b_graph = –1.333333333333  rule: `b_num/b_denom`
- period = 4.712388980385  rule: `2*pi/abs(b_graph)`
- amp = 0.75  rule: `abs(a_graph)`

Inline slots:
- #1 variable-ref ref=a value=3/4 offset=62612
  context: Which graph represents the function y = [[slot]]cos([[slot]]x), where x is in degrees?
- #2 variable-ref ref=a value=3/4 offset=62622
  context: Which graph represents the function y = [[slot]]cos([[slot]]x), where x is in degrees?
- #3 variable-ref ref=b value=-4/3 offset=62684
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=62694
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=62706
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=62716
  context: [[slot]]

## record-7 @ 82202

- Metadata: Average | Section 5.1 | T4 | Graphing Sine and Cosine Functions | function | amplitude | period | sinusoidal function
- Counts: strings=155, variables=10, display=10, refs=30, slots=9, visibleChoices=4

```text
Which function is represented by the graph shown below, where is in radians?[[slot]] A. y = [[slot]]sin([[slot]]x) C. y =[[slot]] cos([[slot]]x) B. y =[[slot]] sin([[slot]]x) D. y = [[slot]]cos([[slot]]x)
```

Choices:
- A. y = [[slot]]sin([[slot]]x)
- B. y =[[slot]] sin([[slot]]x)
- C. y =[[slot]] cos([[slot]]x)
- D. y = [[slot]]cos([[slot]]x)

Variables:
- a_num = 5  rule: `range(-5,5)`
- a_denom = –4  rule: `range(-6,6)`
- a = -5/4  rule: `fracs(a_num,a_denom)`
- b_num = 4  rule: `range(-5,5)`
- b_denom = –2  rule: `range(-5,5)`
- b = -2  rule: `fracs(b_num,b_denom)`
- a_graph = –1.25  rule: `a_num/a_denom`
- b_graph = –2  rule: `b_num/b_denom`
- period = 3.14159265359  rule: `2*pi/abs(b_graph)`
- amp = 1.25  rule: `abs(a_graph)`

Inline slots:
- #1 variable-ref ref=a value=-5/4 offset=83844
  context: is in radians? [[slot]]
- #2 variable-ref ref=a value=-5/4 offset=83864
  context: y = [[slot]]sin([[slot]]x)
- #3 variable-ref ref=b value=-2 offset=83874
  context: y = [[slot]]sin([[slot]]x)
- #4 variable-ref ref=b value=-2 offset=83894
  context: y =[[slot]] cos([[slot]]x)
- #5 variable-ref ref=a value=-5/4 offset=83906
  context: y =[[slot]] cos([[slot]]x)
- #6 variable-ref ref=b value=-2 offset=83928
  context: y =[[slot]] sin([[slot]]x)
- #7 variable-ref ref=a value=-5/4 offset=83940
  context: y =[[slot]] sin([[slot]]x)
- #8 variable-ref ref=a value=-5/4 offset=83962
  context: y = [[slot]]cos([[slot]]x)
- #9 variable-ref ref=b value=-2 offset=83972
  context: y = [[slot]]cos([[slot]]x)

## record-8 @ 93456

- Metadata: Average | Section 5.1 | T4 | Graphing Sine and Cosine Functions | function | amplitude | period | sinusoidal function
- Counts: strings=139, variables=10, display=9, refs=26, slots=9, visibleChoices=0

```text
Which function is represented by the graph shown below, where x is in degrees?[[slot]] a. y = [[slot]]sin([[slot]]x) c. y = [[slot]]cos([[slot]]x) b. y =[[slot]] cos([[slot]]x) d. y =[[slot]] sin([[slot]]x)
```

Variables:
- a_num = 3  rule: `range(-5,5)`
- a_denom = 3  rule: `range(-6,6)`
- a = 1  rule: `fracs(a_num,a_denom)`
- b_num = 5  rule: `range(-5,5)`
- b_denom = 4  rule: `range(-5,5)`
- b = 5/4  rule: `fracs(b_num,b_denom)`
- a_graph = 1  rule: `a_num/a_denom`
- b_graph = 1.25  rule: `b_num/b_denom`
- period = 5.026548245744  rule: `2*pi/abs(b_graph)`
- amp = 1  rule: `abs(a_graph)`

Inline slots:
- #1 variable-ref ref=b value=5/4 offset=95084
  context: Which function is represented by the graph shown below, where x is in degrees? [[slot]]
- #2 variable-ref ref=a value=1 offset=95102
  context: y = [[slot]]sin([[slot]]x)
- #3 variable-ref ref=a value=1 offset=95112
  context: y = [[slot]]sin([[slot]]x)
- #4 variable-ref ref=a value=1 offset=95136
  context: y = [[slot]]cos([[slot]]x)
- #5 variable-ref ref=a value=1 offset=95146
  context: y = [[slot]]cos([[slot]]x)
- #6 variable-ref ref=a value=1 offset=95170
  context: y =[[slot]] cos([[slot]]x)
- #7 variable-ref ref=b value=5/4 offset=95182
  context: y =[[slot]] cos([[slot]]x)
- #8 variable-ref ref=a value=1 offset=95204
  context: y =[[slot]] sin([[slot]]x)
- #9 variable-ref ref=b value=5/4 offset=95216
  context: y =[[slot]] sin([[slot]]x)

## record-9 @ 102972

- Metadata: Easy | Section 5.2 | T4 | Transformations of Sinusoidal Functions | translation | primary trigonometric function
- Counts: strings=191, variables=5, display=9, refs=59, slots=10, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The graph of [[slot]] can be obtained by translating the graph of [[slot]] A. [[slot]] units to the [[slot]] C. [[slot]] units to the [[slot]] B. [[slot]] units to the [[slot]] D. [[slot]] units to the [[slot]]
```

Choices:
- A. [[slot]] units to the [[slot]]
- B. [[slot]] units to the [[slot]]
- C. [[slot]] units to the [[slot]]
- D. [[slot]] units to the [[slot]]

Variables:
- function1 = 1  rule: `range(1,2)`
- select_function = sin  rule: `choose(function1,"sin","cos")`
- other_function = cos  rule: `choose(function1,"cos","sin")`
- direction = right  rule: `if(function1=1,"right","left")`
- direction1 = right  rule: `if(function1=1,"right","left")`

Inline slots:
- #1 variable-ref ref=select_function value=sin offset=103978
  context: The graph of [[slot]] can be obtained by translating the graph of [[slot]]
- #2 variable-ref ref=other_function value=cos offset=104070
  context: The graph of [[slot]] can be obtained by translating the graph of [[slot]]
- #3 variable-ref ref=direction1 value=right offset=104080
  context: [[slot]] units to the [[slot]]
- #4 variable-ref ref=direction1 value=right offset=104110
  context: [[slot]] units to the [[slot]]
- #5 variable-ref ref=direction value=right offset=104120
  context: [[slot]] units to the [[slot]]
- #6 variable-ref ref=direction value=right offset=104150
  context: [[slot]] units to the [[slot]]
- #7 unknown-object ref=- value=- offset=104162
  context: [[slot]] units to the [[slot]]
- #8 unknown-object ref=- value=- offset=104192
  context: [[slot]] units to the [[slot]]
- #9 unknown-object ref=- value=- offset=104202
  context: [[slot]] units to the [[slot]]
- #10 unknown-object ref=- value=- offset=104232
  context: [[slot]] units to the [[slot]]

## record-10 @ 109726

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | amplitude | sinusoidal function
- Counts: strings=135, variables=8, display=9, refs=24, slots=5, visibleChoices=4

```text
What is the amplitude of the sinusoidal function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 2 4 7 9

Variables:
- a = 7  rule: `range(-9,9)`
- b = –8  rule: `range(-9,9)`
- c = 3  rule: `choose(rand(4),2,3,4,6)`
- d = – 5  rule: `range(-9,9)`
- ans = 7  rule: `abs(a)`
- function = 1  rule: `range(1,2)`
- select_function = sin  rule: `if(function=1,"sin","cos")`
- sin = ?  rule: `J`

Inline slots:
- #1 variable-ref ref=a value=7 offset=110984
  context: What is the amplitude of the sinusoidal function [[slot]]?
- #2 variable-ref ref=select_function value=sin offset=110996
  context: [[slot]]
- #3 variable-ref ref=b value=–8 offset=111006
  context: [[slot]]
- #4 variable-ref ref=c value=3 offset=111018
  context: [[slot]]
- #5 variable-ref ref=d value=– 5 offset=111028
  context: [[slot]]

## record-11 @ 114310

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | period | sinusoidal function
- Counts: strings=136, variables=10, display=9, refs=17, slots=5, visibleChoices=4

```text
What is the period of the sinusoidal function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = –  rule: `range(-9,9)`
- b = 8  rule: `range(-9,9)`
- c = 2  rule: `choose(rand(4),2,3,4,6)`
- d = – 2  rule: `range(-9,9)`
- ans = 1/4  rule: `fracs(2,abs(b))`
- dis1 = 4  rule: `fracs(abs(b),2)`
- dis2 = 1/2  rule: `fracs(1,abs(c))`
- dis3 = 1/8  rule: `fracs(abs(a),abs(b))`
- function = 2  rule: `range(1,2)`
- select_function = cos  rule: `if(function=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=a value=– offset=115836
  context: What is the period of the sinusoidal function [[slot]]?
- #2 variable-ref ref=select_function value=cos offset=115848
  context: [[slot]]
- #3 variable-ref ref=b value=8 offset=115860
  context: [[slot]]
- #4 variable-ref ref=c value=2 offset=115874
  context: [[slot]]
- #5 variable-ref ref=d value=– 2 offset=115886
  context: [[slot]]

## record-12 @ 118929

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | phase shift | sinusoidal function
- Counts: strings=154, variables=10, display=11, refs=38, slots=5, visibleChoices=4

```text
Determine the phase shift of the sinusoidal function [[slot]]. A. [[slot]] units to the right C. [[slot]] units to the left B. [[slot]] units to the left D. [[slot]] units to the right
```

Choices:
- A. [[slot]] units to the right
- B. [[slot]] units to the left
- C. [[slot]] units to the left
- D. [[slot]] units to the right 6 8

Variables:
- a = –6  rule: `range(-9,9)`
- b = 5  rule: `range(-9,9)`
- c = 3  rule: `choose(rand(4),2,3,4,6)`
- d = + 2  rule: `range(-9,9)`
- ans = 2/5  rule: `fracs(2,b)`
- dis1 = 5/2  rule: `fracs(b,2)`
- dis2 = 1/3  rule: `fracs(1,c)`
- dis3 = -6/5  rule: `fracs(a,b)`
- function = 1  rule: `range(1,2)`
- select_function = sin  rule: `if(function=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=a value=–6 offset=120409
  context: Determine the phase shift of the sinusoidal function [[slot]].
- #2 variable-ref ref=a value=–6 offset=120421
  context: [[slot]] units to the right
- #3 variable-ref ref=a value=–6 offset=120469
  context: [[slot]] units to the left
- #4 variable-ref ref=select_function value=sin offset=120517
  context: [[slot]]
- #5 variable-ref ref=b value=5 offset=120565
  context: [[slot]]

## record-13 @ 124584

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | graph | sinusoidal function | transformation
- Counts: strings=161, variables=10, display=9, refs=22, slots=5, visibleChoices=4

```text
Which graph represents the sinusoidal function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 5 6 7

Variables:
- a = –  rule: `range(-4,4)`
- b = 3  rule: `range(-4,4)`
- c = 6  rule: `choose(rand(4),2,3,4,6)`
- d = – 2  rule: `range(-4,4)`
- ans = 2/3  rule: `fracs(2,b)`
- dis1 = 3/2  rule: `fracs(b,2)`
- dis2 = 1/6  rule: `fracs(1,c)`
- dis3 = 1/3  rule: `fracs(a,b)`
- function = 1  rule: `range(1,2)`
- select_function = sin  rule: `if(function=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=a value=– offset=126116
  context: Which graph represents the sinusoidal function [[slot]]?
- #2 variable-ref ref=b value=3 offset=126128
  context: [[slot]]
- #3 variable-ref ref=c value=6 offset=126138
  context: [[slot]]
- #4 variable-ref ref=d value=– 2 offset=126150
  context: [[slot]]
- #5 variable-ref ref=d value=– 2 offset=126160
  context: [[slot]]

## record-14 @ 145689

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | graph | sinusoidal function | transformation
- Counts: strings=161, variables=11, display=9, refs=22, slots=5, visibleChoices=4

```text
Which graph represents the sinusoidal function [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 0 2 5 6 7

Variables:
- a = –  rule: `range(-4,4)`
- b = –3  rule: `range(-4,4)`
- c = 4  rule: `choose(rand(4),2,3,4,6)`
- d = + 2  rule: `range(-4,4)`
- ans = -2/3  rule: `fracs(2,b)`
- dis1 = -3/2  rule: `fracs(b,2)`
- dis2 = 1/4  rule: `fracs(1,c)`
- dis3 = -1/3  rule: `fracs(a,b)`
- function = 2  rule: `range(1,2)`
- select_function = cos  rule: `if(function=1,"sin","cos")`
- cos = H  rule: `J`

Inline slots:
- #1 variable-ref ref=a value=– offset=147229
  context: Which graph represents the sinusoidal function [[slot]]?
- #2 variable-ref ref=b value=–3 offset=147241
  context: [[slot]]
- #3 variable-ref ref=c value=4 offset=147251
  context: [[slot]]
- #4 variable-ref ref=d value=+ 2 offset=147263
  context: [[slot]]
- #5 variable-ref ref=d value=+ 2 offset=147273
  context: [[slot]]

## record-15 @ 166802

- Metadata: Difficult | Section 5.2 | T4 | Transformations of Sinusoidal Functions | transformations | equation | properties | sinusoidal function
- Counts: strings=186, variables=3, display=21, refs=47, slots=16, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
amp_denom<>amp_num and abs(phase_denom)>1 and abs(phase_num)>1 and phase_num<>phase_denom and period_num<>period_denom 4/5 3/2 – 9 3/2 amp_num/amp_denom 0.63 1.5 5/2 3/2 Give an equation for a transformed sine function with an amplitude of [[slot]], a period of [[slot]], a phase shift of [[slot]] rad to the right, and a vertical translation of [[slot]] units down. A. y = [[slot]] [[slot]] C. y = [[slot]] [[slot]] B. y = [[slot]] sin [[slot]] [[slot]] [[slot]] D. y = [[slot]] sin [[slot]] [[slot]] [[slot]]
```

Choices:
- A. y = [[slot]] [[slot]]
- B. y = [[slot]] sin [[slot]] [[slot]] [[slot]]
- C. y = [[slot]] [[slot]]
- D. y = [[slot]] sin [[slot]] [[slot]] [[slot]]

Variables:
- amp_num = 5  rule: `range(1,9)`
- amp_denom = 8  rule: `range(1,9)`
- amp = 5/8  rule: `fracs(amp_num,amp_denom)`

Inline slots:
- #1 variable-ref ref=amp value=5/8 offset=169312
  context: Give an equation for a transformed sine function with an amplitude of [[slot]], a period of [[slot]], a phase shift of [[slot]] rad to the right, and a vertical transla
- #2 variable-ref ref=amp value=5/8 offset=169342
  context: ve an equation for a transformed sine function with an amplitude of [[slot]], a period of [[slot]], a phase shift of [[slot]] rad to the right, and a vertical translation of [[slot]] units
- #3 variable-ref ref=amp value=5/8 offset=169382
  context: ormed sine function with an amplitude of [[slot]], a period of [[slot]], a phase shift of [[slot]] rad to the right, and a vertical translation of [[slot]] units down.
- #4 variable-ref ref=amp value=5/8 offset=169482
  context: od of [[slot]], a phase shift of [[slot]] rad to the right, and a vertical translation of [[slot]] units down.
- #5 variable-ref ref=amp value=5/8 offset=169524
  context: y = [[slot]] [[slot]]
- #6 unknown-object ref=- value=- offset=169528
  context: y = [[slot]] [[slot]]
- #7 unknown-object ref=- value=- offset=169546
  context: y = [[slot]] [[slot]]
- #8 unknown-object ref=- value=- offset=169550
  context: y = [[slot]] [[slot]]
- #9 unknown-object ref=- value=- offset=169570
  context: y = [[slot]] sin [[slot]]
- #10 unknown-object ref=- value=- offset=169582
  context: y = [[slot]] sin [[slot]]
- #11 unknown-object ref=- value=- offset=169586
  context: [[slot]] [[slot]]
- #12 unknown-object ref=- value=- offset=169590
  context: [[slot]] [[slot]]
- #13 unknown-object ref=- value=- offset=169608
  context: y = [[slot]] sin [[slot]]
- #14 unknown-object ref=- value=- offset=169620
  context: y = [[slot]] sin [[slot]]
- #15 unknown-object ref=- value=- offset=169624
  context: [[slot]] [[slot]]
- #16 unknown-object ref=- value=- offset=169628
  context: [[slot]] [[slot]]

## record-16 @ 175776

- Metadata: Easy | Section 5.3 | T4 | The Tangent Function | graph | tangent function
- Counts: strings=159, variables=3, display=9, refs=30, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which function represents the graph shown, where x is in radians?[[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 2

Variables:
- function = 1  rule: `range(1,2)`
- ans = tan  rule: `if(function=1,"tan","-tan")`
- dis1 = -tan  rule: `if(function=2,"tan","-tan")`

Inline slots:
- #1 variable-ref ref=ans value=tan offset=176488
  context: Which function represents the graph shown, where x is in radians? [[slot]]
- #2 variable-ref ref=dis1 value=-tan offset=176498
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=176508
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=176520
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=176530
  context: [[slot]]

## record-17 @ 186402

- Metadata: Easy | Section 5.3 | T4 | The Tangent Function | asymptote | tangent function
- Counts: strings=280, variables=7, display=9, refs=49, slots=5, visibleChoices=5

```text
Which of the following is not an asymptote of the function [[slot]]? A. x = [[slot]] C. x = [[slot]] B. x = [[slot]] D. [[slot]]
```

Choices:
- A. x = [[slot]]
- B. x = [[slot]]
- C. x = [[slot]]
- D. [[slot]]
- H. \

Variables:
- n1 = –7  rule: `choose(rand(10),-9,-7,-5,-3,-1,1,3,5,7,9)`
- n2 = –9  rule: `choose(rand(10),-9,-7,-5,-3,-1,1,3,5,7,9)`
- n3 = –5  rule: `choose(rand(10),-9,-7,-5,-3,-1,1,3,5,7,9)`
- d1 = –  rule: `range(-5,5)`
- ans1 = -7/2  rule: `fracs(n1,2)`
- ans2 = -9/2  rule: `fracs(n2,2)`
- ans3 = -5/2  rule: `fracs(n3,2)`

Inline slots:
- #1 variable-ref ref=ans1 value=-7/2 offset=187644
  context: Which of the following is not an asymptote of the function [[slot]]?
- #2 variable-ref ref=ans3 value=-5/2 offset=187664
  context: x = [[slot]]
- #3 variable-ref ref=ans2 value=-9/2 offset=187684
  context: x = [[slot]]
- #4 variable-ref ref=d1 value=– offset=187706
  context: x = [[slot]]
- #5 variable-ref ref=n1 value=–7 offset=187718
  context: [[slot]]

## record-18 @ 195761

- Metadata: Average | Section 5.3 | T4 | The Tangent Function | undefined | tangent function
- Counts: strings=127, variables=8, display=9, refs=25, slots=5, visibleChoices=4

```text
Given the trigonometric function [[slot]], which is the x-coordinate at which the function is undefined? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 2

Variables:
- n = + 9  rule: `choose(rand(10),-9,-7,-5,-3,-1,1,3,5,7,9)`
- n1 = 3  rule: `choose(rand(8),-7,-5,-3,-1,1,3,5,7)`
- n2 = –1  rule: `choose(rand(10),-7,-5,-4,-2,-1,1,2,4,5,7)`
- n3 = –7  rule: `choose(rand(6),-7,-5,-1,1,5,7)`
- f1 = 3/4  rule: `fracs(n1,4)`
- f2 = -1/3  rule: `fracs(n2,3)`
- f3 = -7/6  rule: `fracs(n3,6)`
- ans = 9/2  rule: `fracs(n,2)`

Inline slots:
- #1 variable-ref ref=n value=+ 9 offset=197049
  context: Given the trigonometric function [[slot]], which is the x-coordinate at which the function is undefined?
- #2 variable-ref ref=ans value=9/2 offset=197185
  context: [[slot]]
- #3 variable-ref ref=f2 value=-1/3 offset=197197
  context: [[slot]]
- #4 variable-ref ref=f3 value=-7/6 offset=197211
  context: [[slot]]
- #5 variable-ref ref=f1 value=3/4 offset=197223
  context: [[slot]]

## record-19 @ 200139

- Metadata: Average | Section 5.3 | T4 | The Tangent Function | coordinate | tangent function
- Counts: strings=1211, variables=36, display=9, refs=369, slots=26, visibleChoices=4

```text
Given the trigonometric function [[slot]], find the value of the y-coordinate of the point with x-coordinate [[slot]] A. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] C. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] B. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] D. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- B. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- C. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- D. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]

Variables:
- n = –7  rule: `range(-9,9)`
- A1 = –1215  rule: `45+180*n`
- A2 = –1170  rule: `90+n*180`
- A3 = –1125  rule: `135+180*n`
- A4 = –1080  rule: `180+180*n`
- A5 = –1230  rule: `30+180*n`
- A6 = –1200  rule: `60+180*n`
- angle_choose = 6  rule: `rand(6)`
- angle = –1200  rule: `choose(angle_choose,A1,A2,A3,A4,A5,A6)`
- ans1 = 0  rule: `if(angle=A1,1,0)`
- ans2 = 0  rule: `if(angle=A2,1,0)`
- ans3 = 0  rule: `if(angle=A3,1,0)`
- ans4 = 0  rule: `if(angle=A4,1,0)`
- ans5 = 0  rule: `if(angle=A5,1,0)`
- ans6 = 1  rule: `if(angle=A6,1,0)`
- dis1 = –1125  rule: `choose(rand(6),A1,A2,A3,A4,A5,A6)`
- dis2 = –1215  rule: `choose(rand(6),A1,A2,A3,A4,A5,A6)`
- dis3 = –1170  rule: `choose(rand(6),A1,A2,A3,A4,A5,A6)`
- dis1_1 = 0  rule: `if(dis1=A1,1,0)`
- dis1_2 = 0  rule: `if(dis1=A2,1,0)`
- dis1_3 = 1  rule: `if(dis1=A3,1,0)`
- dis1_4 = 0  rule: `if(dis1=A4,1,0)`
- dis1_5 = 0  rule: `if(dis1=A5,1,0)`
- dis1_6 = 0  rule: `if(dis1=A6,1,0)`

Inline slots:
- #1 variable-ref ref=n value=–7 offset=203823
  context: Given the trigonometric function [[slot]], find the value of the y-coordinate of the point with x-coordinate [[slot]]
- #2 variable-ref ref=angle value=–1200 offset=203961
  context: tric function [[slot]], find the value of the y-coordinate of the point with x-coordinate [[slot]]
- #3 variable-ref ref=ans5 value=0 offset=203975
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #4 variable-ref ref=ans6 value=1 offset=203977
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #5 variable-ref ref=dis2_5 value=0 offset=203979
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #6 variable-ref ref=dis2_6 value=0 offset=203981
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #7 variable-ref ref=dis1_5 value=0 offset=203983
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #8 variable-ref ref=dis1_6 value=0 offset=203985
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #9 variable-ref ref=dis3_5 value=0 offset=203995
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #10 variable-ref ref=dis3_6 value=0 offset=203997
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #11 variable-ref ref=ans1 value=0 offset=203999
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #12 variable-ref ref=ans2 value=0 offset=204001
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #13 variable-ref ref=dis1_1 value=0 offset=204003
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #14 variable-ref ref=dis1_2 value=0 offset=204005
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #15 variable-ref ref=dis2_1 value=1 offset=204017
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #16 variable-ref ref=dis2_2 value=0 offset=204019
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #17 variable-ref ref=dis3_1 value=0 offset=204021
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #18 variable-ref ref=dis3_2 value=1 offset=204023
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #19 variable-ref ref=n value=–7 offset=204025
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #20 variable-ref ref=ans1 value=0 offset=204027
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #21 variable-ref ref=ans2 value=0 offset=204037
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #22 variable-ref ref=dis2_1 value=1 offset=204039
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #23 variable-ref ref=dis2_2 value=0 offset=204041
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #24 variable-ref ref=ans2 value=0 offset=204043
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #25 variable-ref ref=dis3_1 value=0 offset=204045
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #26 variable-ref ref=dis3_2 value=1 offset=204047
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]

## record-20 @ 239067

- Metadata: Easy | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | amplitude | sinusoidal function
- Counts: strings=81, variables=2, display=9, refs=5, slots=4, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
What is the radius of the Ferris wheel? A. [[slot]] m C. [[slot]] m B. [[slot]] m D. [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m
- F. / 2 5 7

Variables:
- dis1 = 9  rule: `a/2`
- dis2 = 36  rule: `2*a`

Inline slots:
- #1 variable-ref ref=dis1 value=9 offset=239615
  context: [[slot]] m
- #2 variable-ref ref=dis2 value=36 offset=239629
  context: [[slot]] m
- #3 fixed-value ref=- value=- offset=239645
  context: [[slot]] m
- #4 fixed-value ref=- value=- offset=239659
  context: [[slot]] m

## record-21 @ 242069

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | period | sinusoidal function
- Counts: strings=104, variables=1, display=9, refs=22, slots=4, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
How long does it take for the wheel to revolve once? A. [[slot]] s C. [[slot]] s B. [[slot]] s D. [[slot]] s
```

Choices:
- A. [[slot]] s
- B. [[slot]] s
- C. [[slot]] s
- D. [[slot]] s 4 5 8

Variables:
- ans = 160  rule: `2*p`

Inline slots:
- #1 variable-ref ref=ans value=160 offset=242581
  context: [[slot]] s
- #2 unknown-object ref=- value=- offset=242595
  context: [[slot]] s
- #3 unknown-object ref=- value=- offset=242611
  context: [[slot]] s
- #4 unknown-object ref=- value=- offset=242625
  context: [[slot]] s

## record-22 @ 245637

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | minimum | sinusoidal function
- Counts: strings=77, variables=2, display=9, refs=5, slots=4, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the minimum height of a car? A. [[slot]] m C. [[slot]] m B. [[slot]] m D. [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m

Variables:
- height = 9  rule: `trans-a`
- dis1 = 160  rule: `trans+p`

Inline slots:
- #1 variable-ref ref=dis1 value=160 offset=246203
  context: [[slot]] m
- #2 variable-ref ref=height value=9 offset=246217
  context: [[slot]] m
- #3 fixed-value ref=- value=- offset=246233
  context: [[slot]] m
- #4 fixed-value ref=- value=- offset=246247
  context: [[slot]] m

## record-23 @ 248657

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | maximum | sinusoidal function
- Counts: strings=76, variables=2, display=9, refs=4, slots=4, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the maximum height of a car? A. [[slot]] m C. [[slot]] m B. [[slot]] m D. [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m

Variables:
- height = 31  rule: `trans+a`
- dis1 = 160  rule: `trans+p`

Inline slots:
- #1 variable-ref ref=dis1 value=160 offset=249153
  context: [[slot]] m
- #2 variable-ref ref=height value=31 offset=249167
  context: [[slot]] m
- #3 fixed-value ref=- value=- offset=249183
  context: [[slot]] m
- #4 fixed-value ref=- value=- offset=249197
  context: [[slot]] m

## record-24 @ 251427

- Metadata: Easy | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | minimum | sinusoidal function
- Counts: strings=73, variables=1, display=10, refs=3, slots=3, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the piston s minimum height? A. [[slot]] cm C. 0 cm B. –[[slot]] cm D. [[slot]] cm
```

Choices:
- A. [[slot]] cm
- B. –[[slot]] cm
- C. 0 cm
- D. [[slot]] cm

Variables:
- dis = 7  rule: `trans/2`

Inline slots:
- #1 variable-ref ref=dis value=7 offset=251907
  context: [[slot]] cm
- #2 fixed-value ref=- value=- offset=251943
  context: –[[slot]] cm
- #3 fixed-value ref=- value=- offset=251959
  context: [[slot]] cm

## record-25 @ 254027

- Metadata: Easy | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | period | sinusoidal function
- Counts: strings=72, variables=4, display=9, refs=4, slots=4, visibleChoices=4

```text
What is the period? A. [[slot]] s C. [[slot]] s B. [[slot]] s D. [[slot]] s
```

Choices:
- A. [[slot]] s
- B. [[slot]] s
- C. [[slot]] s
- D. [[slot]] s

Variables:
- period = 1/40  rule: `fracs(2,p)`
- dis = 1/14  rule: `fracs(1,trans)`
- dis2 = 7/40  rule: `fracs(trans,p)`
- dis3 = 8  rule: `fracs(p,10)`

Inline slots:
- #1 variable-ref ref=dis2 value=7/40 offset=254761
  context: [[slot]] s
- #2 variable-ref ref=period value=1/40 offset=254775
  context: [[slot]] s
- #3 variable-ref ref=dis3 value=8 offset=254791
  context: [[slot]] s
- #4 variable-ref ref=dis value=1/14 offset=254805
  context: [[slot]] s

## record-26 @ 257035

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | linear trigonometric equation
- Counts: strings=157, variables=9, display=9, refs=26, slots=10, visibleChoices=5

```text
Solve [[slot]] to three decimal places on the interval [[slot]]. A. x = [[slot]], x = [[slot]] C. x = [[slot]], x = [[slot]] B. x = [[slot]], x = [[slot]] D. x = [[slot]], x = [[slot]]
```

Choices:
- A. x = [[slot]], x = [[slot]]
- B. x = [[slot]], x = [[slot]]
- C. x = [[slot]], x = [[slot]]
- D. x = [[slot]], x = [[slot]] 3 4 7 9
- G. _

Variables:
- a = 6  rule: `range(-6,6,1)`
- b = + 2  rule: `range(-6,6,1)`
- ans1 = 1.911  rule: `arccos(-b/a)`
- ans2 = 4.373  rule: `(2*pi)-ans1`
- dis1 = 0.340  rule: `abs(arcsin(-b/a))`
- dis2 = 5.943  rule: `(2*pi)-dis1`
- dis3 = 1.231  rule: `arccos(b/a)`
- dis4 = 5.052  rule: `(2*pi)-dis3`
- dis5 = 1.231  rule: `pi-ans1`

Inline slots:
- #1 variable-ref ref=a value=6 offset=258273
  context: Solve [[slot]] to three decimal places on the interval [[slot]] .
- #2 variable-ref ref=b value=+ 2 offset=258357
  context: Solve [[slot]] to three decimal places on the interval [[slot]] .
- #3 variable-ref ref=dis1 value=0.340 offset=258379
  context: x = [[slot]], x = [[slot]]
- #4 variable-ref ref=dis2 value=5.943 offset=258393
  context: x = [[slot]], x = [[slot]]
- #5 variable-ref ref=ans1 value=1.911 offset=258411
  context: x = [[slot]], x = [[slot]]
- #6 variable-ref ref=dis5 value=1.231 offset=258425
  context: x = [[slot]], x = [[slot]]
- #7 variable-ref ref=dis3 value=1.231 offset=258445
  context: x = [[slot]], x = [[slot]]
- #8 variable-ref ref=dis4 value=5.052 offset=258459
  context: x = [[slot]], x = [[slot]]
- #9 variable-ref ref=ans1 value=1.911 offset=258477
  context: x = [[slot]], x = [[slot]]
- #10 variable-ref ref=ans2 value=4.373 offset=258491
  context: x = [[slot]], x = [[slot]]

## record-27 @ 262588

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | linear trigonometric equation
- Counts: strings=161, variables=9, display=13, refs=29, slots=10, visibleChoices=4

```text
Solve [[slot]], to the nearest tenth of a degree, if necessary, on the interval [[slot]]. A. x = [[slot]], x = [[slot]] C. x = [[slot]], x = [[slot]] B. x = [[slot]], x = [[slot]] D. x = [[slot]], x = [[slot]]
```

Choices:
- A. x = [[slot]], x = [[slot]]
- B. x = [[slot]], x = [[slot]]
- C. x = [[slot]], x = [[slot]]
- D. x = [[slot]], x = [[slot]]

Variables:
- a = –5  rule: `range(-6,6,1)`
- b = + 3  rule: `range(-6,6,1)`
- ans1 = 53.1  rule: `180*arccos(-b/a)/pi`
- ans2 = 306.9  rule: `(360)-ans1`
- dis1 = 36.9  rule: `abs(arcsin(-b/a))*180/pi`
- dis2 = 323.1  rule: `360-dis1`
- dis3 = 126.9  rule: `arccos(b/a)*180/pi`
- dis4 = 233.1  rule: `360-dis3`
- dis5 = 126.9  rule: `180-ans1`

Inline slots:
- #1 variable-ref ref=b value=+ 3 offset=263854
  context: Solve [[slot]], to the nearest tenth of a degree, if necessary, on the interval [[slot]] .
- #2 variable-ref ref=a value=–5 offset=263988
  context: Solve [[slot]], to the nearest tenth of a degree, if necessary, on the interval [[slot]] .
- #3 variable-ref ref=b value=+ 3 offset=264010
  context: x = [[slot]]
- #4 variable-ref ref=ans1 value=53.1 offset=264026
  context: , x = [[slot]]
- #5 variable-ref ref=dis5 value=126.9 offset=264046
  context: x = [[slot]]
- #6 variable-ref ref=dis1 value=36.9 offset=264062
  context: , x = [[slot]]
- #7 variable-ref ref=dis2 value=323.1 offset=264084
  context: x = [[slot]]
- #8 variable-ref ref=dis3 value=126.9 offset=264100
  context: , x = [[slot]]
- #9 variable-ref ref=dis4 value=233.1 offset=264120
  context: x = [[slot]]
- #10 variable-ref ref=ans1 value=53.1 offset=264136
  context: , x = [[slot]]

## record-28 @ 268519

- Metadata: Easy | Section 5.1 | Section 5.2 | T4 | Graphing Sine and Cosine Functions | Transformations of Sinusoidal Functions | amplitude | period | phase shift | vertical displacement | sinusoidal function
- Counts: strings=48, variables=5, display=1, refs=12, slots=2, visibleChoices=0

```text
For the function [[slot]], [[slot]] affects the _______________ of the graph.
```

Variables:
- parameter_choose = 4  rule: `rand(4)`
- select_parameter = d  rule: `choose(parameter_choose,"a","b","c","d")`
- ans = vertical displacement  rule: `choose(parameter_choose,"amplitude","period","phase shift or horizontal displacement","vertical displacement")`
- function = cos  rule: `choose(rand(2),"sin","cos")`
- cos = ?  rule: `?`

Inline slots:
- #1 variable-ref ref=function value=cos offset=269687
  context: For the function [[slot]], [[slot]] affects the _______________ of the graph.
- #2 variable-ref ref=select_parameter value=d offset=269693
  context: For the function [[slot]], [[slot]] affects the _______________ of the graph.

## record-29 @ 271880

- Metadata: Easy | Section 5.1 | Section 5.3 | T4 | Graphing Sine and Cosine Functions | The Tangent Function | period | primary trigonometric function
- Counts: strings=28, variables=3, display=1, refs=3, slots=1, visibleChoices=0

```text
The period of the basic [[slot]] function is _______________.
```

Variables:
- choices = 1  rule: `rand(3)`
- function = sine  rule: `choose(choices,"sine","cosine","tangent")`
- ans = 2p  rule: `if(function="tangent","p","2p")`

Inline slots:
- #1 variable-ref ref=function value=sine offset=272602
  context: The period of the basic [[slot]] function is _______________ .

## record-30 @ 274224

- Metadata: Average | Section 5.2 | Section 5.3 | T4 | Graphing Sine and Cosine Functions | The Tangent Function | maximum | primary trigonometric function
- Counts: strings=65, variables=8, display=1, refs=13, slots=1, visibleChoices=0

```text
The maximum value of the function [[slot]] is _______________.
```

Variables:
- choices = 2  rule: `rand(3)`
- function = cos  rule: `choose(choices,"sin","cos","tan")`
- a = 3  rule: `range(-9,9)`
- b = 6  rule: `choose(rand(5),2,3,4,6,12)`
- d = – 9  rule: `range(-9,9)`
- ans_sine_or_cosine = –6  rule: `str(d+abs(a))`
- ans_tan = There is no maximum value.  rule: `"There is no maximum value."`
- ans = –6  rule: `if(choices=3,ans_tan,ans_sine_or_cosine)`

Inline slots:
- #1 variable-ref ref=a value=3 offset=275592
  context: The maximum value of the function [[slot]] is _______________ .

## record-31 @ 277588

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | period | sinusoidal function
- Counts: strings=59, variables=7, display=1, refs=14, slots=1, visibleChoices=0

```text
The period of the function [[slot]] is _______________.
```

Variables:
- choices = 1  rule: `rand(2)`
- function = sin  rule: `choose(choices,"sin","cos")`
- a = –8  rule: `range(-9,9)`
- b = 3  rule: `choose(rand(5),2,3,4,6,12)`
- c = – 9  rule: `range(-9,9)`
- d = – 3  rule: `range(-9,9)`
- ans = 6  rule: `2*b`

Inline slots:
- #1 variable-ref ref=a value=–8 offset=278620
  context: The period of the function [[slot]] is _______________ .

## record-32 @ 280656

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | phase shift | sinusoidal function
- Counts: strings=64, variables=9, display=1, refs=14, slots=1, visibleChoices=0

```text
The phase shift of the function [[slot]] is _______________ unit(s) to the _______________.
```

Variables:
- choices = 1  rule: `rand(2)`
- function = sin  rule: `choose(choices,"sin","cos")`
- a = –8  rule: `range(-9,9)`
- b = 12  rule: `choose(rand(5),2,3,4,6,12)`
- c = – 7  rule: `range(-9,9)`
- d = + 2  rule: `range(-9,9)`
- ans = 7  rule: `abs(c)`
- direction = right  rule: `if(c>0,"left","right")`
- right = ?  rule: `T`

Inline slots:
- #1 variable-ref ref=a value=–8 offset=281834
  context: The phase shift of the function [[slot]] is _______________ unit(s) to the _______________.

## record-33 @ 284100

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | transformations | sinusoidal function | graph | equation
- Counts: strings=29, variables=0, display=1, refs=11, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=284394
  context: [[slot]]

## record-34 @ 285871

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | transformations | sinusoidal function | graph | equation
- Counts: strings=29, variables=0, display=1, refs=11, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=286165
  context: [[slot]]

## record-35 @ 287642

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | transformations | sinusoidal function | graph | equation
- Counts: strings=29, variables=0, display=1, refs=11, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=287936
  context: [[slot]]

## record-36 @ 289413

- Metadata: Average | Section 5.2 | T4 | Graphing Sine and Cosine Functions | transformations | sinusoidal function | graph | equation
- Counts: strings=29, variables=0, display=1, refs=11, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=289707
  context: [[slot]]

## record-37 @ 291184

- Metadata: Easy | Section 5.2 | T4 | Graphing Sine and Cosine Functions | phase shift
- Counts: strings=77, variables=0, display=1, refs=24, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Explain how you could graph the function [[slot]] given a table of values containing ordered pairs for the function [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=291464
  context: Explain how you could graph the function [[slot]] given a table of values containing ordered pairs for the function [[slot]].
- #2 math-object ref=- value=- offset=291600
  context: h the function [[slot]] given a table of values containing ordered pairs for the function [[slot]].

## record-38 @ 295031

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | trigonometric equation
- Counts: strings=223, variables=0, display=2, refs=67, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
When a ball is thrown, the horizontal distance, d, in metres, travelled can be modelled by the equation [[slot]], where [[slot]]; v is the velocity with which the ball is thrown, in metres per second; and is the angle of elevation, in radians. If a ball is thrown at 30 m/s, what angle of elevation is required for the ball to travel 30 m?
```

Inline slots:
- #1 math-object ref=- value=- offset=295491
  context: thrown, the horizontal distance, d, in metres, travelled can be modelled by the equation [[slot]], where [[slot]]; v is the velocity with which the ball is thrown, in metres per second; a
- #2 math-object ref=- value=- offset=295509
  context: izontal distance, d, in metres, travelled can be modelled by the equation [[slot]], where [[slot]]; v is the velocity with which the ball is thrown, in metres per second; and

## record-39 @ 321942

- Metadata: Average | Section 5.4 | T4 | Graphing Sine and Cosine Functions | sinusoidal function | equation
- Counts: strings=104, variables=0, display=1, refs=40, slots=0, visibleChoices=0

```text
A Ferris wheel of diameter 18.5 m rotates at a rate of 0.2 rad/s. If passengers board the lowest car at a height of 3 m above the ground, determine a sinusoidal function that models the height, h, in metres, of the car relative to the ground as a function of the time, t, in seconds.
```

## record-40 @ 328764

- Metadata: Easy | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | sinusoidal function
- Counts: strings=53, variables=0, display=1, refs=10, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The water level at an ocean inlet has a depth, d, in metres, that varies with the time, t, in hours after midnight, according to the equation [[slot]]. What is the water depth at 2:30 a.m., to the nearest hundredth of a metre?
```

Inline slots:
- #1 math-object ref=- value=- offset=329288
  context: metres, that varies with the time, t, in hours after midnight, according to the equation [[slot]]. What is the water depth at 2:30 a.m., to the nearest hundredth of a metre?

## record-41 @ 332441

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | transformations | sinusoidal function
- Counts: strings=55, variables=0, display=1, refs=16, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Describe the transformations that, when applied to the graph of y = cos x, result in the graph of [[slot]].
```

Inline slots:
- #1 diagram-object ref=- value=- offset=332903
  context: the transformations that, when applied to the graph of y = cos x, result in the graph of [[slot]].

## record-42 @ 335781

- Metadata: Easy | Section 5.3 | T4 | The Tangent Function | tangent function | graph
- Counts: strings=106, variables=0, display=1, refs=33, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of [[slot]] for two cycles and state the domain, range, period, and equations of the asymptotes. x is measured in radians.
```

Inline slots:
- #1 diagram-object ref=- value=- offset=336017
  context: Sketch the graph of [[slot]] for two cycles and state the domain, range, period, and equations of the asymptotes. x is

## record-43 @ 344896

- Metadata: Easy | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | sinusoidal function | modelling
- Counts: strings=77, variables=0, display=1, refs=25, slots=0, visibleChoices=0

```text
A pebble is embedded in the tread of a rotating bicycle wheel of diameter 60 cm. If the wheel rotates at 4 revolutions per second, determine a relationship between the height, h, in centimetres, of the pebble above the ground as a function of time, t, in seconds.
```

## record-44 @ 349925

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | sinusoidal function | maximum | minimum
- Counts: strings=107, variables=0, display=2, refs=37, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A population, p, of bears varies according to [[slot]], where t is the time, in years, and angles are measured in radians.a) What are the maximum and minimum populations?b) What is the first interval, in years and months, over which the population is increasing? [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=350303
  context: A population, p, of bears varies according to [[slot]], where t is the time, in years, and angles are measured in radians. a) What are the maxim
- #2 unknown-object ref=- value=- offset=350931
  context: [[slot]]

## record-45 @ 359397

- Metadata: Difficult | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | period | amplitude | sinusoidal function
- Counts: strings=191, variables=0, display=1, refs=58, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A girl jumps rope such that the height, h, in metres, of the middle of the rope can be approximated by the equation [[slot]], where t is the time, in seconds.a) What is the amplitude of this function?b) How many revolutions of the rope does the girl make in 1 min?
```

Inline slots:
- #1 math-object ref=- value=- offset=359921
  context: t the height, h, in metres, of the middle of the rope can be approximated by the equation [[slot]], where t is the time, in seconds. a) What is the amplitude of this function? b) How many

## record-46 @ 374615

- Metadata: Difficult | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | linear trigonometric equation
- Counts: strings=140, variables=0, display=2, refs=34, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
When a pendulum that is 0.5 m long swings back and forth, its angular displacement,, in radians, from rest position is given by [[slot]], where t is the time, in seconds. At what time(s) during the first 4 s is the pendulum displaced 1 cm vertically above its rest position? (Assume the pendulum is at its rest position at t = 0.)
```

Inline slots:
- #1 unknown-object ref=- value=- offset=375145
  context: , in radians, from rest position is given by [[slot]], where t is the time, in seconds. At what time(s) during the first 4 s is the pendulum di

## record-47 @ 419617

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | sinusoidal function | graph | transformations
- Counts: strings=44, variables=0, display=1, refs=7, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of [[slot]] for two cycles, where angles are in radians.
```

Inline slots:
- #1 diagram-object ref=- value=- offset=419939
  context: Sketch the graph of [[slot]] for two cycles, where angles are in radians.

## record-48 @ 426280

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | sinusoidal function | graph | transformations
- Counts: strings=54, variables=0, display=1, refs=14, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Sketch the graph of [[slot]] for [[slot]].
```

Inline slots:
- #1 diagram-object ref=- value=- offset=426602
  context: Sketch the graph of [[slot]] for [[slot]].
- #2 diagram-object ref=- value=- offset=426614
  context: Sketch the graph of [[slot]] for [[slot]].

## record-49 @ 433305

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | equation | sinusoidal function | graph
- Counts: strings=68, variables=0, display=1, refs=21, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The period is 12 h 24 min, or 12.4 h.[[slot]]An equation that models the depth of the water is [[slot]].At 10:00 a.m., t = 2. Substitute t = 2 into the equation.[[slot]]The depth of the water at 10 a.m. is 2.1 m.
```

Inline slots:
- #1 math-object ref=- value=- offset=434809
  context: The period is 12 h 24 min, or 12.4 h. [[slot]] An equation that models the depth of the water is [[slot]] . At 10:00 a.m., t = 2. Substi
- #2 math-object ref=- value=- offset=434913
  context: iod is 12 h 24 min, or 12.4 h. [[slot]] An equation that models the depth of the water is [[slot]] . At 10:00 a.m., t = 2. Substitute t = 2 into the equation. [[slot]] The depth of the wat
- #3 math-object ref=- value=- offset=435037
  context: epth of the water is [[slot]] . At 10:00 a.m., t = 2. Substitute t = 2 into the equation. [[slot]] The depth of the water at 10 a.m. is 2.1 m.

## record-50 @ 437971

- Metadata: Difficult | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | sinusoidal function | graph | modelling
- Counts: strings=83, variables=0, display=1, refs=25, slots=0, visibleChoices=0

```text
A mass is suspended by a spring such that it hangs at rest 0.5 m above the ground. The mass is raised 40 cm and released at time t = 0 s, causing it to oscillate sinusoidally. If the mass returns to the high position every 1.2 s, determine the height of the mass above the ground at t = 0.7 s.
```

## record-51 @ 443238

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | model | sinusoidal function | graph
- Counts: strings=569, variables=0, display=1, refs=94, slots=0, visibleChoices=0

```text
A windmill has blades that are 20 m in length, and the centre of their circular motion is a point 23 m above the ground. The blades have a frequency of 4 revolutions per minute when in operation.a) Use a sinusoidal function to model the height above the ground of the tip of one blade as a function of time.b) Graph the function over three complete cycles.c) How far above the ground is the tip of the blade after 10 s?
```

## record-52 @ 523296

- Metadata: Average | Section 5.4 | T4 | Equations and Graphs of Trigonometric Functions | model | sinusoidal function | maximum | minimum | predict
- Counts: strings=248, variables=0, display=1, refs=55, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The air quality index, I, in a large city can be modelled by the equation [[slot]], where t represents the time, in hours, after midnight. New legislation has been introduced that is expected to decrease the pollution levels in the city so that the index values will decrease to 90% of current values in 10 years.a) What are the current minimum and maximum values of the index in the city?b) At what time of the day is the air quality index at a maximum?c) If an air quality alert is issued for times when the index is above 48, during what time period will an air quality alert be issued?d) What factors in the equation for air quality index will be affected by the legislation? Explain how they will be affected.e) What will the new air quality index equation be based on your answers in part d)?f) How will these changes affect the times when an air quality alert will be issued?
```

Inline slots:
- #1 math-object ref=- value=- offset=523766
  context: The air quality index, I, in a large city can be modelled by the equation [[slot]], where t represents the time, in hours, after midnight. New legislation has been introduc

## record-53 @ 542645

- Metadata: Average | Section 5.1 | Section 5.2 | T4 | Graphing Sine and Cosine Functions | Transformations of Sinusoidal Functions | model | sinusoidal function | amplitude | maximum | minimum
- Counts: strings=102, variables=0, display=2, refs=34, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The flapping of a bird s wing can be modelled by the function [[slot]], where y represents the distance the tip of the wing travels, in centimetres, and t represents the time, in seconds.a) Determine the period of the motion of the wing.b) Determine the amplitude, the minimum value, and the maximum value.c) What are the first times after t = 0 that the tip of the wing reaches the minimum and maximum values?d) Determine the position of the wing tip at i) [[slot]] sii) [[slot]] siii) [[slot]] s
```

Inline slots:
- #1 math-object ref=- value=- offset=543181
  context: s wing can be modelled by the function [[slot]], where y represents the distance the tip of the wing travels, in centimetres, and t repre
- #2 unknown-object ref=- value=- offset=543969
  context: reaches the minimum and maximum values? d) Determine the position of the wing tip at i) [[slot]] s ii) [[slot]] s iii) [[slot]] s
- #3 unknown-object ref=- value=- offset=543985
  context: nimum and maximum values? d) Determine the position of the wing tip at i) [[slot]] s ii) [[slot]] s iii) [[slot]] s
- #4 unknown-object ref=- value=- offset=544003
  context: m values? d) Determine the position of the wing tip at i) [[slot]] s ii) [[slot]] s iii) [[slot]] s

## record-54 @ 550351

- Metadata: Average | Section 5.1 | Section 5.2 | T4 | Graphing Sine and Cosine Functions | Transformations of Sinusoidal Functions | model | periodic function | predict
- Counts: strings=28, variables=0, display=1, refs=7, slots=0, visibleChoices=0

```text
Wilson places a measuring tape on a pillar of a dock to record the water level in his local coastal community. He finds that a high tide of 1.77 m occurs at 5:17 a.m., and a low tide of 0.21 m occurs at 11:38 a.m.a) Estimate the period of the fluctuation of the water level.b) Estimate the amplitude of the pattern.c) Predict when the next two high tides will occur.d) Predict when the next two low tides will occur.
```

## record-55 @ 554464

- Metadata: Difficult | Section 5.1 | Section 5.3 | T4 | Graphing Sine and Cosine Functions | The Tangent Function | sine function | cosine function | intercepts | graph
- Counts: strings=120, variables=0, display=3, refs=29, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function y = sin x – cos x.a) Predict the y-intercept of the function.b) Predict the x-intercepts from 0 to 360.c) Explain why your answers in part b) can be found by solving tan x = 1.d) Graph the function for the interval [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=555314
  context: wers in part b) can be found by solving tan x = 1. d) Graph the function for the interval [[slot]].

## record-56 @ 573722

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | graph | transformations | cosine function | equation
- Counts: strings=62, variables=0, display=1, refs=11, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The graph of [[slot]] is transformed so that the amplitude becomes 2 and the x-intercepts coincide with the maximum values. a) What is the equation of the transformed function?b) What phase shift of the transformed function will produce a y-intercept of –1?c) What is the equation of the function after the transformation in part b)?d) Verify your solution to part c) by graphing.
```

Choices:
- G. v

Inline slots:
- #1 diagram-object ref=- value=- offset=574044
  context: The graph of [[slot]] is transformed so that the amplitude becomes 2 and the x-intercepts coincide with the max

## record-57 @ 582224

- Metadata: Difficult | Section 5.2 | T4 | Transformations of Sinusoidal Functions | points of intersection | cosine function | coterminal angles
- Counts: strings=64, variables=0, display=3, refs=8, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A cosine function has half the period of the function [[slot]]. All other properties of the two functions are identical.a) Determine the number of points of intersection if these two functions are graphed on the interval [[slot]]. Explain.b) Determine the values of x of the first two points of intersection to the right of x = 0.c) If the graph of the two functions were extended to 720, how many points of intersection would there be? Explain.d) Use the concept of coterminal angles to determine the values of x where the points of intersection would occur.e) Graph the two functions over the interval [[slot]] to verify your answer for parts b), c), and d).
```

Inline slots:
- #1 math-object ref=- value=- offset=582648
  context: A cosine function has half the period of the function [[slot]]. All other properties of the two functions are identical. a) Determine the number of poin
- #2 unknown-object ref=- value=- offset=582970
  context: e the number of points of intersection if these two functions are graphed on the interval [[slot]]. Explain. b) Determine the values of x of the first two points of intersection to the rig
- #3 diagram-object ref=- value=- offset=583734
  context: here the points of intersection would occur. e) Graph the two functions over the interval [[slot]] to verify your answer for parts b), c), and d).

## record-58 @ 593519

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | equation | sine function | cosine function
- Counts: strings=40, variables=0, display=2, refs=9, slots=0, visibleChoices=0

```text
A sinusoidal function has an amplitude of 2, a period of 180, and a maximum at (0, 4).a) Represent this function with an equation using a sine function.b) Represent this function with an equation using a cosine function.c) Explain how these two functions are related.
```

## record-59 @ 597554

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | amplitude | period | shifts | transformations | sine function
- Counts: strings=144, variables=0, display=1, refs=47, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider the function [[slot]].a) Determine the amplitude, the period, the phase shift, and the vertical shift of the function with respect to [[slot]].b) What are the minimum and maximum values of the function?c) Determine the x-intercepts of the function in the interval [[slot]].d) Determine the y-intercept of the function.
```

Inline slots:
- #1 math-object ref=- value=- offset=597912
  context: Consider the function [[slot]]. a) Determine the amplitude, the period, the phase shift, and the vertical shift of the f
- #2 math-object ref=- value=- offset=598142
  context: tude, the period, the phase shift, and the vertical shift of the function with respect to [[slot]]. b) What are the minimum and maximum values of the function? c) Determine the x-intercept
- #3 math-object ref=- value=- offset=598392
  context: mum values of the function? c) Determine the x-intercepts of the function in the interval [[slot]]. d) Determine the y-intercept of the function.

## record-60 @ 605603

- Metadata: Average | Section 5.2 | T4 | Transformations of Sinusoidal Functions | transformations | domain | range | sine function
- Counts: strings=372, variables=5, display=1, refs=56, slots=1, visibleChoices=0

```text
Use the following information to answer the questions. The height, h, in metres, above the ground of a car as a Ferris wheel rotates can be modelled by the function [[slot]], where t is the time, in seconds.
```

Variables:
- d = P  rule: `[[slot]]`
- z = ?  rule: `1`
- p = 80  rule: `range(80,160,10)`
- trans = 19  rule: `range(10,20)`
- a = 18  rule: `range(8,18)`

Inline slots:
- #1 variable-ref ref=a value=18 offset=613360
  context: tres, above the ground of a car as a Ferris wheel rotates can be modelled by the function [[slot]], where t is the time, in seconds.

