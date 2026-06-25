# Record Inspection: Chapter 02.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 11/Chapter 02.bnk`
- Inflated bytes: 1668453
- Records: 60
- Inline slots: 196
- Slot classes: variable-ref=161, unknown-object=28, fixed-value=3, diagram-object=4

## record-1 @ 4628

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | reference angle | < 180
- Counts: strings=100, variables=5, display=6, refs=7, slots=5, visibleChoices=4

```text
What is the reference angle for [[slot]] in standard position? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- angle = 15  rule: `range(5,180,5)`
- ANS1 = 15  rule: `if ((angle<90), angle,180-angle)`
- DIS1 = 30  rule: `2*angle`
- DIS2 = 345  rule: `360-angle`
- DIS3 = 255  rule: `270-angle`

Inline slots:
- #1 variable-ref ref=angle value=15 offset=5582
  context: What is the reference angle for [[slot]]
- #2 variable-ref ref=DIS3 value=255 offset=5636
  context: [[slot]]
- #3 variable-ref ref=DIS2 value=345 offset=5646
  context: [[slot]]
- #4 variable-ref ref=DIS1 value=30 offset=5658
  context: [[slot]]
- #5 variable-ref ref=ANS1 value=15 offset=5668
  context: [[slot]]

## record-2 @ 8186

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | reference angle | > 180
- Counts: strings=102, variables=5, display=6, refs=7, slots=5, visibleChoices=4

```text
What is the reference angle for [[slot]] in standard position? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- angle = 200  rule: `range(185,355,5)`
- ANS1 = 20  rule: `if ((angle<270), angle-180,360-angle)`
- DIS1 = 100  rule: `angle/2`
- DIS2 = 110  rule: `angle-90`
- DIS3 = 70  rule: `abs(270-angle)`

Inline slots:
- #1 variable-ref ref=angle value=200 offset=9166
  context: What is the reference angle for [[slot]]
- #2 variable-ref ref=DIS1 value=100 offset=9220
  context: [[slot]]
- #3 variable-ref ref=ANS1 value=20 offset=9230
  context: [[slot]]
- #4 variable-ref ref=DIS3 value=70 offset=9242
  context: [[slot]]
- #5 variable-ref ref=DIS2 value=110 offset=9252
  context: [[slot]]

## record-3 @ 11770

- Metadata: Average | Section 2.1 | T 1 | Angles in Standard Position | reference angle
- Counts: strings=159, variables=13, display=13, refs=26, slots=13, visibleChoices=4

```text
What are the three other angles in standard position that have a reference angle of [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]] [[slot]] [[slot]]
- B. [[slot]] [[slot]] [[slot]]
- C. [[slot]] [[slot]] [[slot]]
- D. [[slot]] [[slot]] [[slot]]

Variables:
- angle = 54  rule: `rand(89)`
- ANS1 = 126  rule: `180-angle`
- ANS2 = 234  rule: `180+angle`
- ANS3 = 306  rule: `360-angle`
- DIS1 = 108  rule: `2*angle`
- DIS2 = 162  rule: `3*angle`
- DIS3 = 216  rule: `4*angle`
- DIS4 = 144  rule: `90+angle`
- DIS5 = 234  rule: `180+angle`
- DIS6 = 324  rule: `270+angle`
- DIS7 = 99  rule: `angle+45`
- DIS8 = 144  rule: `angle+90`
- DIS9 = 234  rule: `angle+180`

Inline slots:
- #1 variable-ref ref=angle value=54 offset=13306
  context: What are the three other angles in standard position that have a reference angle of [[slot]]
- #2 variable-ref ref=DIS7 value=99 offset=13318
  context: [[slot]]
- #3 variable-ref ref=DIS8 value=144 offset=13326
  context: [[slot]]
- #4 variable-ref ref=DIS9 value=234 offset=13334
  context: [[slot]]
- #5 variable-ref ref=DIS4 value=144 offset=13344
  context: [[slot]]
- #6 variable-ref ref=DIS5 value=234 offset=13352
  context: [[slot]]
- #7 variable-ref ref=DIS6 value=324 offset=13360
  context: [[slot]]
- #8 variable-ref ref=DIS1 value=108 offset=13372
  context: [[slot]]
- #9 variable-ref ref=DIS2 value=162 offset=13380
  context: [[slot]]
- #10 variable-ref ref=DIS3 value=216 offset=13388
  context: [[slot]]
- #11 variable-ref ref=ANS1 value=126 offset=13398
  context: [[slot]]
- #12 variable-ref ref=ANS2 value=234 offset=13406
  context: [[slot]]
- #13 variable-ref ref=ANS3 value=306 offset=13414
  context: [[slot]]

## record-4 @ 17616

- Metadata: Average | Section 2.1 | T 1 | Angles in Standard Position | special angles | sine
- Counts: strings=132, variables=10, display=6, refs=7, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the exact sine of [[slot]]?[[slot]] 1/[[slot]] 2/[[slot]] 1/3 [[slot]]/2
```

Choices:
- A. 1/[[slot]]
- B. 1/3
- C. 2/[[slot]]
- D. [[slot]]/2

Variables:
- angleList = A, B  rule: `list("A","B")`
- whichAngle = 1  rule: `rand(2)`
- angle = A  rule: `choose(whichAngle, angleList)`
- base = 12  rule: `rand(20)`
- hypotenuse = 24  rule: `2*base`
- height = 0  rule: `str("?3")`
- opposite = 1  rule: `if(whichAngle=1,opposite1,opposite3)`
- base2 = 12  rule: `str(base)`
- opposite1 = 1  rule: `str(1)`
- opposite3 = 1/3  rule: `sqrs(3)`

Inline slots:
- #1 variable-ref ref=angle value=A offset=18928
  context: [[slot]]? [[slot]]
- #2 variable-ref ref=opposite3 value=1/3 offset=18934
  context: [[slot]]? [[slot]]
- #3 variable-ref ref=opposite3 value=1/3 offset=18946
  context: 1/[[slot]]
- #4 variable-ref ref=opposite value=1 offset=18958
  context: 2/[[slot]]
- #5 unknown-object ref=- value=- offset=18980
  context: [[slot]]/2

## record-5 @ 32932

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | special angles | cosine
- Counts: strings=122, variables=4, display=5, refs=6, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the exact cosine of [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. 1
- C. [[slot]]
- D. [[slot]] 5

Variables:
- angleList = A, B  rule: `list("A","B")`
- whichAngle = 1  rule: `rand(2)`
- angle = A  rule: `choose(whichAngle, angleList)`
- base = 18  rule: `rand(20)`

Inline slots:
- #1 variable-ref ref=angle value=A offset=33706
  context: [[slot]]? [[slot]]
- #2 variable-ref ref=base value=18 offset=33714
  context: [[slot]]? [[slot]]
- #3 unknown-object ref=- value=- offset=33722
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=33730
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=33748
  context: [[slot]]

## record-6 @ 47862

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | co-terminal angles
- Counts: strings=174, variables=14, display=13, refs=20, slots=13, visibleChoices=5

```text
Which set of angles has the same terminal arm as [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]]
```

Choices:
- A. [[slot]], [[slot]], [[slot]]
- B. [[slot]], [[slot]], [[slot]]
- C. [[slot]], [[slot]], [[slot]]
- D. [[slot]], [[slot]], [[slot]] 2 3 4 5 7 8 9
- F. \

Variables:
- angle = 40  rule: `range(5,85,5)`
- ANS1 = 400  rule: `angle+360`
- ANS2 = 760  rule: `angle+720`
- ANS3 = 1120  rule: `angle+1080`
- DIS1 = 200  rule: `ANS1/2`
- DIS2 = 380  rule: `ANS2/2`
- DIS3 = 560  rule: `ANS3/2`
- DIS4 = 130  rule: `angle+90`
- DIS5 = 220  rule: `angle+180`
- DIS6 = 310  rule: `angle+270`
- DIS7 = 80  rule: `2*angle`
- DIS8 = 120  rule: `3*angle`
- DIS9 = 160  rule: `4*angle`
- k = ?  rule: `$`

Inline slots:
- #1 variable-ref ref=angle value=40 offset=49328
  context: Which set of angles has the same terminal arm as [[slot]]
- #2 variable-ref ref=DIS7 value=80 offset=49340
  context: [[slot]]
- #3 variable-ref ref=DIS8 value=120 offset=49348
  context: , [[slot]]
- #4 variable-ref ref=DIS9 value=160 offset=49356
  context: , [[slot]]
- #5 variable-ref ref=DIS1 value=200 offset=49366
  context: [[slot]]
- #6 variable-ref ref=DIS2 value=380 offset=49374
  context: , [[slot]]
- #7 variable-ref ref=DIS3 value=560 offset=49382
  context: , [[slot]]
- #8 variable-ref ref=DIS4 value=130 offset=49394
  context: [[slot]]
- #9 variable-ref ref=DIS5 value=220 offset=49402
  context: , [[slot]]
- #10 variable-ref ref=DIS6 value=310 offset=49410
  context: , [[slot]]
- #11 variable-ref ref=ANS1 value=400 offset=49420
  context: [[slot]]
- #12 variable-ref ref=ANS2 value=760 offset=49428
  context: , [[slot]]
- #13 variable-ref ref=ANS3 value=1120 offset=49436
  context: , [[slot]]

## record-7 @ 53494

- Metadata: Average | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | point on terminal arm | cosine | sine | tangent
- Counts: strings=288, variables=12, display=6, refs=105, slots=14, visibleChoices=4

```text
The point ([[slot]], [[slot]]) is on the terminal arm of A. Which is the set of exact primary trigonometric ratios for the angle? [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]]
```

Choices:
- A. [[slot]], [[slot]], [[slot]]
- B. [[slot]], [[slot]], [[slot]]
- C. [[slot]], [[slot]], [[slot]]
- D. [[slot]], [[slot]], [[slot]]

Variables:
- x = 40  rule: `range(-100,100,1)`
- y = –9  rule: `range(-100,100,1)`
- r = 41  rule: `sqr(pow(x,2)+pow(y,2))`
- sin_num = 9  rule: `abs(y/gcf(abs(y),r))`
- sin_denom = 41  rule: `abs(r/gcf(abs(y),r))`
- cos_num = 40  rule: `abs(x/gcf(abs(x),r))`
- cos_denom = 41  rule: `abs(r/gcf(abs(x),r))`
- tan_num = 9  rule: `abs(y/gcf(abs(x),abs(y)))`
- tan_denom = 40  rule: `abs(x/gcf(abs(x),abs(y)))`
- sign_sine = !  rule: `if(sgn(y)=sgn(r),chr(32),chr(45))`
- sign_cos = !  rule: `if(sgn(x)=sgn(r),chr(32),chr(45))`
- sign_tan = ?  rule: `if(sgn(y)=sgn(x),chr(32),chr(45))`

Inline slots:
- #1 variable-ref ref=x value=40 offset=55250
  context: The point ([[slot]], [[slot]]) is on the terminal arm of
- #2 variable-ref ref=y value=–9 offset=55256
  context: The point ([[slot]], [[slot]]) is on the terminal arm of
- #3 variable-ref ref=sign_sine value=! offset=55466
  context: [[slot]], [[slot]], [[slot]]
- #4 variable-ref ref=sin_denom value=41 offset=55472
  context: [[slot]], [[slot]], [[slot]]
- #5 variable-ref ref=sin_num value=9 offset=55478
  context: [[slot]], [[slot]], [[slot]]
- #6 variable-ref ref=sign_cos value=! offset=55488
  context: [[slot]], [[slot]], [[slot]]
- #7 variable-ref ref=cos_denom value=41 offset=55494
  context: [[slot]], [[slot]], [[slot]]
- #8 variable-ref ref=cos_num value=40 offset=55500
  context: [[slot]], [[slot]], [[slot]]
- #9 variable-ref ref=sign_tan value=if(sgn(y)=sgn(x),chr(32),chr(45)) offset=55510
  context: [[slot]], [[slot]], [[slot]]
- #10 variable-ref ref=tan_num value=9 offset=55516
  context: [[slot]], [[slot]], [[slot]]
- #11 variable-ref ref=tan_denom value=40 offset=55522
  context: [[slot]], [[slot]], [[slot]]
- #12 variable-ref ref=sign_cos value=! offset=55532
  context: [[slot]], [[slot]], [[slot]]
- #13 variable-ref ref=cos_num value=40 offset=55538
  context: [[slot]], [[slot]], [[slot]]
- #14 variable-ref ref=cos_denom value=41 offset=55544
  context: [[slot]], [[slot]], [[slot]]

## record-8 @ 65432

- Metadata: Average | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | point on terminal arm | cosine | sine | tangent
- Counts: strings=264, variables=12, display=5, refs=82, slots=8, visibleChoices=4

```text
The coordinates of a point P on the terminal arm of an angle are shown. What are the exact trigonometric ratios for [[slot]], [[slot]], and [[slot]]?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- x = –8  rule: `range(-20,-1,1)`
- y = 6  rule: `range(2,20,1)`
- r = 10  rule: `sqr(pow(x,2)+pow(y,2))`
- sin_num = 3  rule: `abs(y/gcf(abs(y),r))`
- sin_denom = 5  rule: `abs(r/gcf(abs(y),r))`
- cos_num = 4  rule: `abs(x/gcf(abs(x),r))`
- cos_denom = 5  rule: `abs(r/gcf(abs(x),r))`
- tan_num = 3  rule: `abs(y/gcf(abs(x),abs(y)))`
- tan_denom = 4  rule: `abs(x/gcf(abs(x),abs(y)))`
- sign_sine = !  rule: `if(sgn(y)=sgn(r),chr(32),chr(45))`
- sign_cos = !  rule: `if(sgn(x)=sgn(r),chr(32),chr(45))`
- sign_tan = ?  rule: `if(sgn(y)=sgn(x),chr(32),chr(45))`

Inline slots:
- #1 variable-ref ref=x value=–8 offset=67376
  context: P on the terminal arm of an angle are shown. What are the exact trigonometric ratios for [[slot]], [[slot]], and [[slot]]? [[slot]]
- #2 variable-ref ref=y value=6 offset=67382
  context: terminal arm of an angle are shown. What are the exact trigonometric ratios for [[slot]], [[slot]], and [[slot]]? [[slot]]
- #3 variable-ref ref=sign_cos value=! offset=67396
  context: f an angle are shown. What are the exact trigonometric ratios for [[slot]], [[slot]], and [[slot]]? [[slot]]
- #4 variable-ref ref=cos_num value=4 offset=67402
  context: are shown. What are the exact trigonometric ratios for [[slot]], [[slot]], and [[slot]]? [[slot]]
- #5 variable-ref ref=cos_denom value=5 offset=67410
  context: [[slot]]
- #6 variable-ref ref=sign_sine value=! offset=67420
  context: [[slot]]
- #7 variable-ref ref=sin_num value=3 offset=67430
  context: [[slot]]
- #8 variable-ref ref=sin_denom value=5 offset=67440
  context: [[slot]]

## record-9 @ 88169

- Metadata: Easy | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | tangent
- Counts: strings=60, variables=2, display=5, refs=11, slots=6, visibleChoices=4

```text
Marco is [[slot]] m due east of the centre of the park. His friend Ray is [[slot]] m due south of the centre of the park. Which is the correct expression for the exact distance between the two boys? [[slot]] m [[slot]] m [[slot]] m [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m

Variables:
- distance = 450  rule: `range(100,1000,50)`
- halfdistance = 225  rule: `distance/2`

Inline slots:
- #1 variable-ref ref=distance value=450 offset=88649
  context: Marco is [[slot]] m due east of the centre of the park. His friend Ray is [[slot]] m due south of the centr
- #2 variable-ref ref=distance value=450 offset=88765
  context: Marco is [[slot]] m due east of the centre of the park. His friend Ray is [[slot]] m due south of the centre of the park. Which is the correct expression for the exact dist
- #3 variable-ref ref=halfdistance value=225 offset=89005
  context: [[slot]] m
- #4 variable-ref ref=distance value=450 offset=89017
  context: [[slot]] m
- #5 variable-ref ref=halfdistance value=225 offset=89031
  context: [[slot]] m
- #6 variable-ref ref=distance value=450 offset=89043
  context: [[slot]] m

## record-10 @ 91975

- Metadata: Average | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | tangent | reference angle | related angles
- Counts: strings=102, variables=5, display=4, refs=13, slots=4, visibleChoices=4

```text
What is the exact value for [[slot]]? [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. 1
- D. [[slot]]

Variables:
- angle = 240  rule: `n*60`
- n = 4  rule: `range(-5,5,1)`
- tan_angle = 1.732050807569  rule: `tan(angle*pi/180)`
- sign = $  rule: `if(sgn(tan_angle)=1,chr(32),chr(45))`
- DIS1 = ?  rule: `if(sgn(tan_angle)=1,chr(45),chr(32))`

Inline slots:
- #1 variable-ref ref=angle value=240 offset=92997
  context: What is the exact value for [[slot]]?
- #2 variable-ref ref=sign value=$ offset=93009
  context: [[slot]]
- #3 variable-ref ref=DIS1 value=if(sgn(tan_angle)=1,chr(45),chr(32)) offset=93027
  context: [[slot]]
- #4 variable-ref ref=sign value=$ offset=93035
  context: [[slot]]

## record-11 @ 95920

- Metadata: Difficult | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | arccosine | reference angle | related angles |
- Counts: strings=166, variables=11, display=9, refs=35, slots=11, visibleChoices=4

```text
An angle is in standard position such that [[slot]]. What are the possible values of [[slot]], to the nearest degree, if [[slot]]? [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]]
```

Choices:
- A. [[slot]] and [[slot]]
- B. [[slot]] and [[slot]]
- C. [[slot]] and [[slot]]
- D. [[slot]] and [[slot]]

Variables:
- x = 2  rule: `range(-25,25,1)`
- r = 18  rule: `rand(25)`
- cos_num = 1  rule: `x/gcf(abs(x),r)`
- cos_denom = 9  rule: `abs(r/gcf(abs(x),r))`
- ANS1 = 84  rule: `180*acos(cos_num/cos_denom)/pi`
- ANS2 = 276  rule: `360-ANS1`
- DIS1 = 6  rule: `abs(180*asin(cos_num/cos_denom)/pi)`
- DIS2 = 276  rule: `360-ANS1`
- DIS3 = 6  rule: `abs(180*atan(cos_num/cos_denom)/pi)`
- DIS4 = 174  rule: `180-DIS3`
- DIS5 = 264  rule: `180+ANS1`

Inline slots:
- #1 variable-ref ref=x value=2 offset=97540
  context: An angle is in standard position such that [[slot]]. What are the possible values of [[slot]], to the nearest degree, if [[slot]]?
- #2 variable-ref ref=cos_num value=1 offset=97610
  context: An angle is in standard position such that [[slot]]. What are the possible values of [[slot]], to the nearest degree, if [[slot]]?
- #3 variable-ref ref=cos_denom value=9 offset=97668
  context: n such that [[slot]]. What are the possible values of [[slot]], to the nearest degree, if [[slot]]?
- #4 variable-ref ref=DIS3 value=6 offset=97680
  context: [[slot]]
- #5 variable-ref ref=DIS4 value=174 offset=97692
  context: and [[slot]]
- #6 variable-ref ref=ANS1 value=84 offset=97706
  context: [[slot]]
- #7 variable-ref ref=DIS5 value=264 offset=97718
  context: and [[slot]]
- #8 variable-ref ref=DIS1 value=6 offset=97732
  context: [[slot]]
- #9 variable-ref ref=DIS2 value=276 offset=97744
  context: and [[slot]]
- #10 variable-ref ref=ANS1 value=84 offset=97758
  context: [[slot]]
- #11 variable-ref ref=ANS2 value=276 offset=97770
  context: and [[slot]]

## record-12 @ 102575

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | sine law | side length
- Counts: strings=104, variables=8, display=5, refs=9, slots=5, visibleChoices=4

```text
Solve to the nearest tenth of a unit for the unknown side in the ratio[[slot]]. [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- sideb = 12  rule: `rand(25)`
- angleA = 30  rule: `range(10,85,5)`
- angleB = 115  rule: `180-(angleA)-(angleC)`
- ANS = 6.6  rule: `sideb*sin(angleA*(pi/180))/sin(angleB*(pi/180))`
- DIS1 = 21.8  rule: `sideb*sin(angleB*(pi/180))/sin(angleA*(pi/180))`
- DIS2 = 24.6  rule: `abs(sideb*cos(angleA*(pi/180))/cos(angleB*(pi/180)))`
- DIS3 = 24  rule: `sideb/sin(angleA*(pi/180))`
- angleC = 35  rule: `range(5,85,5)`

Inline slots:
- #1 variable-ref ref=angleA value=30 offset=104087
  context: Solve to the nearest tenth of a unit for the unknown side in the ratio [[slot]].
- #2 variable-ref ref=sideb value=12 offset=104097
  context: [[slot]]
- #3 variable-ref ref=angleB value=115 offset=104105
  context: [[slot]]
- #4 variable-ref ref=DIS3 value=24 offset=104115
  context: [[slot]]
- #5 variable-ref ref=ANS value=6.6 offset=104123
  context: [[slot]]

## record-13 @ 106634

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | sine law | side length
- Counts: strings=155, variables=8, display=5, refs=5, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Determine the length of x, to the nearest tenth of a centimetre.[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- sideb = 25  rule: `rand(50)`
- angleA = 70  rule: `range(10,85,5)`
- angleB = 40  rule: `180-(angleA)-(angleC)`
- ANS = 36.5  rule: `sideb*sin(angleA*(pi/180))/sin(angleB*(pi/180))`
- DIS1 = 17.1  rule: `sideb*sin(angleB*(pi/180))/sin(angleA*(pi/180))`
- DIS2 = 11.2  rule: `abs(sideb*cos(angleA*(pi/180))/cos(angleB*(pi/180)))`
- DIS3 = 26.6  rule: `sideb/sin(angleA*(pi/180))`
- angleC = 70  rule: `range(5,85,5)`

Inline slots:
- #1 variable-ref ref=DIS3 value=26.6 offset=108138
  context: Determine the length of x, to the nearest tenth of a centimetre. [[slot]]
- #2 variable-ref ref=DIS2 value=11.2 offset=108146
  context: [[slot]]
- #3 variable-ref ref=ANS value=36.5 offset=108154
  context: [[slot]]
- #4 variable-ref ref=DIS1 value=17.1 offset=108164
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=108172
  context: [[slot]]

## record-14 @ 127478

- Metadata: Difficult | Section 2.3 | T 3 | The Sine Law | sine law | side length | ambiguous case
- Counts: strings=192, variables=11, display=5, refs=22, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Determine, to the nearest tenth of a centimetre, the two possible lengths of a.[[slot]] [[slot]] cm and [[slot]] cm [[slot]] cm and [[slot]] cm [[slot]] cm and [[slot]] cm [[slot]] cm and [[slot]] cm
```

Choices:
- A. [[slot]] cm and [[slot]] cm
- B. [[slot]] cm and [[slot]] cm
- C. [[slot]] cm and [[slot]] cm
- D. [[slot]] cm and [[slot]] cm

Variables:
- sideb = 16  rule: `rand(50)`
- angleB = 27.1  rule: `range(5,85,.1)`
- sidec = 34  rule: `rand(50)`
- C1 = 75.473772940626  rule: `arcsin(sidec*sin(angleB*pi/180)/sideb)*180/pi`
- C2 = 104.526227059374  rule: `(pi-arcsin(sidec*sin(angleB*pi/180)/sideb))*180/pi`
- A1 = 77.426227059374  rule: `180-angleb-C1`
- A2 = 48.373772940626  rule: `180-angleB-C2`
- sidea1 = 34.3  rule: `sideb*sin(A1*pi/180)/sin(angleB*pi/180)`
- sidea2 = 26.3  rule: `sideb*sin(A2*pi/180)/sin(angleb*pi/180)`
- dis1 = 72.8  rule: `sidec*sin(A1*pi/180)/sin(angleB*pi/180)`
- dis2 = 55.8  rule: `sidec*sin(A2*pi/180)/sin(angleb*pi/180)`

Inline slots:
- #1 variable-ref ref=DIS1 value=72.8 offset=129484
  context: Determine, to the nearest tenth of a centimetre, the two possible lengths of a. [[slot]]
- #2 variable-ref ref=sidea2 value=26.3 offset=129492
  context: [[slot]] cm and [[slot]] cm
- #3 variable-ref ref=DIS1 value=72.8 offset=129510
  context: [[slot]] cm and [[slot]] cm
- #4 variable-ref ref=DIS2 value=55.8 offset=129524
  context: [[slot]] cm and [[slot]] cm
- #5 variable-ref ref=sidea1 value=34.3 offset=129542
  context: [[slot]] cm and [[slot]] cm
- #6 variable-ref ref=sidea2 value=26.3 offset=129558
  context: [[slot]] cm and [[slot]] cm
- #7 variable-ref ref=DIS2 value=55.8 offset=129576
  context: [[slot]] cm and [[slot]] cm
- #8 variable-ref ref=sidea1 value=34.3 offset=129590
  context: [[slot]] cm and [[slot]] cm
- #9 fixed-value ref=- value=- offset=129608
  context: [[slot]] cm and [[slot]] cm

## record-15 @ 154964

- Metadata: Difficult | Section 2.3 | T 3 | The Sine Law | sine law | angle measure | ambiguous case
- Counts: strings=215, variables=12, display=10, refs=19, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Determine, to the nearest tenth of a degree, the two possible measures of C.[[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]] [[slot]] and [[slot]]
```

Choices:
- A. [[slot]] and [[slot]]
- B. [[slot]] and [[slot]]
- C. [[slot]] and [[slot]]
- D. [[slot]] and [[slot]]

Variables:
- sidea = 44  rule: `rand(50)`
- angleA = 9  rule: `range(5,85,1)`
- sideb = 46  rule: `rand(50)`
- ANS1 = 9  rule: `(arcsin(sideb*sin(angleA*pi/180)/sidea))*180/pi`
- ANS2 = 171  rule: `180-ANS1`
- DIS2 = 81  rule: `90-ANS1`
- DIS3 = 9  rule: `(arcsin(sidea*sin(angleA*pi/180)/sideb))*180/pi`
- DIS4 = 171  rule: `180-DIS3`
- angleB1 = 9.4  rule: `arcsin(sideb*sin(angleA*pi/180)/sidea)*180/pi`
- angleB2 = 170.587271897843  rule: `180-angleB1`
- angleC1 = 161.6  rule: `180-angleB1-angleA`
- angleC2 = 0.4  rule: `180-angleB2-angleA`

Inline slots:
- #1 variable-ref ref=ANS1 value=9 offset=156796
  context: C. [[slot]]
- #2 variable-ref ref=DIS2 value=81 offset=156804
  context: [[slot]]
- #3 variable-ref ref=angleC1 value=161.6 offset=156816
  context: and [[slot]]
- #4 variable-ref ref=angleC2 value=0.4 offset=156828
  context: [[slot]]
- #5 variable-ref ref=angleC1 value=161.6 offset=156840
  context: and [[slot]]
- #6 variable-ref ref=DIS4 value=171 offset=156854
  context: [[slot]]
- #7 variable-ref ref=DIS3 value=9 offset=156866
  context: and [[slot]]
- #8 variable-ref ref=DIS4 value=171 offset=156878
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=156890
  context: and [[slot]]

## record-16 @ 180706

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law | < 180
- Counts: strings=250, variables=12, display=5, refs=17, slots=4, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
Which of the following triangles cannot be solved using the sine law? Diagrams not drawn to scale. [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- G. c

Variables:
- a = 13  rule: `range(5,15,1)`
- b = 11  rule: `range(2,12,1)`
- angleA = 43  rule: `range(10,85,1)`
- angleB = 76  rule: `range(10,85,1)`
- sidec = 24  rule: `range(5,25,1)`
- angleC = 32  rule: `range(10,85,1)`
- angleD = 25  rule: `range(5,80,1)`
- sided = 20  rule: `range(10,30,1)`
- angleE = 68  rule: `range(25,85,1)`
- sidef = 21  rule: `range(5,25,1)`
- sideg = 22  rule: `range(10,25,1)`
- w = ?  rule: `[[slot]]`

Inline slots:
- #1 unknown-object ref=- value=- offset=182374
  context: [[slot]]
- #2 unknown-object ref=- value=- offset=182382
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=182392
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=182400
  context: [[slot]]

## record-17 @ 232030

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law | angle measure
- Counts: strings=194, variables=7, display=7, refs=34, slots=9, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
angleB<90 and ANS<90 and 180-(angleB+ANS)<90 If [[slot]], c = [[slot]] cm, and b = [[slot]] cm, and ABC is acute, what is the measure of [[slot]], to the nearest tenth of a degree?[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. n

Variables:
- angleB = 58.8  rule: `range(25,65,.1)`
- sidec = 10.3  rule: `range(1,15,.1)`
- sideb = 10.5  rule: `range(2,16,.1)`
- ANS = 57  rule: `(arcsin(sidec*(sin(angleB*pi/180))/sideb))*180/pi`
- DIS1 = 30.5  rule: `(arcsin(sidec*(sin((90-angleB)*pi/180))/sideb))*180/pi`
- DIS2 = 123.0  rule: `180-ANS`
- DIS3 = 149.5  rule: `180-DIS1`

Inline slots:
- #1 variable-ref ref=angleB value=58.8 offset=233362
  context: If [[slot]], c = [[slot]] cm, and b = [[slot]] cm, and
- #2 variable-ref ref=sidec value=10.3 offset=233376
  context: If [[slot]], c = [[slot]] cm, and b = [[slot]] cm, and
- #3 variable-ref ref=sideb value=10.5 offset=233404
  context: If [[slot]], c = [[slot]] cm, and b = [[slot]] cm, and
- #4 variable-ref ref=ANS value=57 offset=233500
  context: ABC is acute, what is the measure of [[slot]], to the nearest tenth of a degree? [[slot]]
- #5 variable-ref ref=DIS1 value=30.5 offset=233574
  context: ABC is acute, what is the measure of [[slot]], to the nearest tenth of a degree? [[slot]]
- #6 variable-ref ref=DIS2 value=123.0 offset=233582
  context: [[slot]]
- #7 variable-ref ref=DIS3 value=149.5 offset=233592
  context: [[slot]]
- #8 unknown-object ref=- value=- offset=233604
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=233614
  context: [[slot]]

## record-18 @ 254597

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | sine law | solution method
- Counts: strings=116, variables=3, display=5, refs=1, slots=1, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
Which strategy would be best to solve for x in the triangle shown?[[slot]] cosine law sine law primary trigonometric ratios none of the above
```

Choices:
- A. cosine law
- B. primary trigonometric ratios
- C. sine law
- D. none of the above
- G. ^

Variables:
- sidea = 30  rule: `range(5,50,1)`
- angleA = 7  rule: `range(5,25,1)`
- angleB = 21  rule: `range(10,65,1)`

Inline slots:
- #1 diagram-object ref=- value=- offset=255323
  context: Which strategy would be best to solve for x in the triangle shown? [[slot]]

## record-19 @ 274125

- Metadata: Easy | Section 2.4 | T 3 | The Cosine Law | cosine law | solution method
- Counts: strings=117, variables=3, display=5, refs=6, slots=1, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which strategy would be best to use to solve for x?[[slot]] primary trigonometric ratios cosine law sine law none of the above
```

Choices:
- A. primary trigonometric ratios
- B. sine law
- C. cosine law
- D. none of the above 1 2 5 6 8

Variables:
- sideb = 11  rule: `range(5,25,1)`
- sidea = 20  rule: `range(5,25,1)`
- angle = 33  rule: `range(5,35,1)`

Inline slots:
- #1 unknown-object ref=- value=- offset=274821
  context: Which strategy would be best to use to solve for x? [[slot]]

## record-20 @ 293623

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law | angle measure
- Counts: strings=163, variables=7, display=5, refs=6, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Determine the measure of x, to the nearest tenth of a degree.[[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- sidea = 40  rule: `range(10,40,1)`
- ANS = 18.1  rule: `arccos((pow(sidea,2)+pow(sideb,2)-pow(sidec,2))/(2*sidea*sideb))*180/pi`
- DIS1 = 25.6  rule: `arccos((pow(sidea,2)+pow(sidec,2)-pow(sideb,2))/(2*sidea*sidec))*180/pi`
- DIS2 = 71.9  rule: `90-ANS`
- DIS3 = 136.3  rule: `arccos((pow(sidec,2)+pow(sideb,2)-pow(sidea,2))/(2*sidec*sideb))*180/pi`
- sideb = 25  rule: `range(10,30,1)`
- sidec = 18  rule: `range(5,35,1)`

Inline slots:
- #1 variable-ref ref=DIS1 value=25.6 offset=295245
  context: Determine the measure of x, to the nearest tenth of a degree. [[slot]]
- #2 variable-ref ref=DIS3 value=136.3 offset=295253
  context: [[slot]]
- #3 variable-ref ref=ANS value=18.1 offset=295263
  context: [[slot]]
- #4 variable-ref ref=DIS2 value=71.9 offset=295275
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=295285
  context: [[slot]]

## record-21 @ 314779

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law | side length
- Counts: strings=149, variables=7, display=5, refs=5, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the length of x, to the nearest tenth of a metre?[[slot]] [[slot]] m [[slot]] m [[slot]] m [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m

Variables:
- sidea = 33  rule: `range(10,40,1)`
- ANS = 26.1  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*cos(angleC*pi/180)))`
- DIS1 = 21.8  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*cos((90-angleC)*pi/180)))`
- DIS2 = 37.6  rule: `sqrt(pow(sidea,2)+pow(sideb,2))`
- DIS3 = 27.7  rule: `sqrt(pow(sidea,2)-pow(sideb,2))`
- sideb = 18  rule: `range(10,30,1)`
- angleC = 52  rule: `range(15,55,1)`

Inline slots:
- #1 variable-ref ref=DIS3 value=27.7 offset=316279
  context: What is the length of x, to the nearest tenth of a metre? [[slot]]
- #2 variable-ref ref=ANS value=26.1 offset=316289
  context: [[slot]] m
- #3 variable-ref ref=DIS1 value=21.8 offset=316301
  context: [[slot]] m
- #4 variable-ref ref=DIS2 value=37.6 offset=316315
  context: [[slot]] m
- #5 fixed-value ref=- value=- offset=316327
  context: [[slot]] m

## record-22 @ 335637

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law | side length
- Counts: strings=182, variables=7, display=7, refs=28, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
sideb>sidea and sideb<(2*sidea) If [[slot]], r = [[slot]] cm, and p = [[slot]] cm, what is the length of q, to the nearest centimetre?[[slot]] [[slot]] cm [[slot]] cm [[slot]] cm [[slot]] cm
```

Choices:
- A. [[slot]] cm
- B. [[slot]] cm
- C. [[slot]] cm
- D. [[slot]] cm

Variables:
- sidea = 20  rule: `range(10,40,1)`
- ANS = 12  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*cos(angleC*pi/180)))`
- DIS1 = 21  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*cos((90-angleC)*pi/180)))`
- DIS2 = 30  rule: `sqrt(pow(sidea,2)+pow(sideb,2))`
- DIS3 = 11  rule: `sqrt(abs(pow(sidea,2)-pow(sideb,2)))`
- sideb = 23  rule: `range(10,30,1)`
- angleC = 31  rule: `range(15,55,1)`

Inline slots:
- #1 variable-ref ref=angleC value=31 offset=337021
  context: If [[slot]]
- #2 variable-ref ref=sidea value=20 offset=337037
  context: , r = [[slot]] cm, and p = [[slot]] cm, what is the length of q, to the nearest centimetre? [[slot]]
- #3 variable-ref ref=sideb value=23 offset=337065
  context: , r = [[slot]] cm, and p = [[slot]] cm, what is the length of q, to the nearest centimetre? [[slot]]
- #4 variable-ref ref=DIS1 value=21 offset=337181
  context: r = [[slot]] cm, and p = [[slot]] cm, what is the length of q, to the nearest centimetre? [[slot]]
- #5 variable-ref ref=ANS value=12 offset=337191
  context: [[slot]] cm
- #6 variable-ref ref=DIS2 value=30 offset=337205
  context: [[slot]] cm
- #7 variable-ref ref=DIS3 value=11 offset=337221
  context: [[slot]] cm
- #8 fixed-value ref=- value=- offset=337235
  context: [[slot]] cm

## record-23 @ 361169

- Metadata: Difficult | Section 2.3 | Section 2.4 | T 3 | The Sine Law | The Cosine Law | cosine law | sine law | solve a triangle
- Counts: strings=299, variables=16, display=5, refs=86, slots=16, visibleChoices=4

```text
Solve the following triangle, rounding side lengths to the nearest tenth of a unit and angle measures to the nearest degree.[[slot]]Diagram not drawn to scale. [[slot]], b = [[slot]], a = [[slot]] [[slot]], [[slot]], c = [[slot]] [[slot]], [[slot]], c = [[slot]] [[slot]], [[slot]], c = [[slot]] [[slot]], [[slot]], c = [[slot]]
```

Choices:
- A. [[slot]], [[slot]], c = [[slot]]
- B. [[slot]], [[slot]], c = [[slot]]
- C. [[slot]], [[slot]], c = [[slot]]
- D. [[slot]], [[slot]], c = [[slot]]

Variables:
- angleA = 152  rule: `range(95,165,1)`
- sidea = 23.5  rule: `range(10,25,.1)`
- sideb = 19  rule: `range(5,20,1)`
- ANS_angleB = 22  rule: `(arcsin(sideb*sin(angleA*pi/180)/sidea))*180/pi`
- ANS_angleC = 6  rule: `180-angleA-ANS_angleB`
- ANS_sidec = 5.0  rule: `sqrt(sidea^2+sideb^2-(2*sidea*sideb*cos(ANS_angleC*pi/180)))`
- angleB_DIS1 = 68  rule: `90-ANS_angleB`
- angleC_DIS2 = 84  rule: `90-ANS_angleC`
- sidec_DIS1 = 28.7  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*sin(angleC_DIS1*pi/180)))`
- angleB_DIS2 = 158  rule: `180-ANS_angleB`
- angleC_DIS1 = 174  rule: `180-ANS_angleC`
- sidec_DIS2 = 5.0  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*sin(angleC_DIS2*pi/180)))`
- angleB_DIS3 = 35  rule: `(arcsin(abs((sidea*sin(angleA*pi/180)/sideb))))*180/pi`
- angleC_DIS3 = 7  rule: `abs(180-angleA-angleB_DIS3)`
- sidec_DIS3 = 28.2  rule: `sqrt(pow(sidea,2)+pow(sideb,2)-(2*sidea*sideb*sin(angleC_DIS3*pi/180)))`
- d = ?  rule: `&`

Inline slots:
- #1 variable-ref ref=angleA value=152 offset=364209
  context: ing side lengths to the nearest tenth of a unit and angle measures to the nearest degree. [[slot]] Diagram not drawn to scale. [[slot]], b = [[slot]], a = [[slot]]
- #2 variable-ref ref=d value=& offset=364271
  context: of a unit and angle measures to the nearest degree. [[slot]] Diagram not drawn to scale. [[slot]], b = [[slot]], a = [[slot]]
- #3 variable-ref ref=d value=& offset=364285
  context: angle measures to the nearest degree. [[slot]] Diagram not drawn to scale. [[slot]], b = [[slot]], a = [[slot]]
- #4 variable-ref ref=d value=& offset=364299
  context: to the nearest degree. [[slot]] Diagram not drawn to scale. [[slot]], b = [[slot]], a = [[slot]]
- #5 variable-ref ref=d value=& offset=364309
  context: [[slot]], [[slot]], c = [[slot]]
- #6 variable-ref ref=sideb value=19 offset=364315
  context: [[slot]], [[slot]], c = [[slot]]
- #7 variable-ref ref=sidea value=23.5 offset=364329
  context: [[slot]], [[slot]], c = [[slot]]
- #8 variable-ref ref=ANS_angleB value=22 offset=364339
  context: [[slot]], [[slot]], c = [[slot]]
- #9 variable-ref ref=d value=& offset=364345
  context: [[slot]], [[slot]], c = [[slot]]
- #10 variable-ref ref=d value=& offset=364359
  context: [[slot]], [[slot]], c = [[slot]]
- #11 variable-ref ref=d value=& offset=364369
  context: [[slot]], [[slot]], c = [[slot]]
- #12 variable-ref ref=d value=& offset=364375
  context: [[slot]], [[slot]], c = [[slot]]
- #13 variable-ref ref=ANS_angleC value=6 offset=364389
  context: [[slot]], [[slot]], c = [[slot]]
- #14 variable-ref ref=d value=& offset=364401
  context: [[slot]], [[slot]], c = [[slot]]
- #15 variable-ref ref=d value=& offset=364407
  context: [[slot]], [[slot]], c = [[slot]]
- #16 variable-ref ref=d value=& offset=364421
  context: [[slot]], [[slot]], c = [[slot]]

## record-24 @ 390079

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law | angle measure
- Counts: strings=548, variables=3, display=13, refs=79, slots=8, visibleChoices=4

```text
a+b>c and a+c>b and b+c>a (arccos((pow(a,2)+pow(b,2)-pow(c,2))/(2*a*b)))*180/pi 91 (arccos((pow(a,2)+pow(c,2)-pow(b,2))/(2*a*c)))*180/pi 48 (arccos((pow(c,2)+pow(b,2)-pow(a,2))/(2*c*b)))*180/pi 40 11 While flying, a helicopter pilot spots a water tower that is [[slot]] km to the north. At the same time, he sees a monument that is [[slot]] km to the south. The tower and the monument are separated by a distance of [[slot]] km along the flat ground. What is the angle made by the water tower, helicopter, and monument? [[slot]] [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 7.4  rule: `range(3,8,.1)`
- b = 8.5  rule: `range(4,9,.1)`
- c = 11.4  rule: `range(6,16,.1)`

Inline slots:
- #1 variable-ref ref=a value=7.4 offset=391505
  context: While flying, a helicopter pilot spots a water tower that is [[slot]] km to the north. At the same time, he sees a monument that is [[slot]] km to the south. T
- #2 variable-ref ref=b value=8.5 offset=391633
  context: ater tower that is [[slot]] km to the north. At the same time, he sees a monument that is [[slot]] km to the south. The tower and the monument are separated by a distance of [[slot]] km al
- #3 variable-ref ref=c value=11.4 offset=391787
  context: at is [[slot]] km to the south. The tower and the monument are separated by a distance of [[slot]] km along the flat ground. What is the angle made by the water tower, helicopter, and monu
- #4 variable-ref ref=b value=8.5 offset=391983
  context: ng the flat ground. What is the angle made by the water tower, helicopter, and monument? [[slot]]
- #5 variable-ref ref=c value=11.4 offset=391993
  context: [[slot]]
- #6 variable-ref ref=a value=7.4 offset=392003
  context: [[slot]]
- #7 variable-ref ref=b value=8.5 offset=392015
  context: [[slot]]
- #8 variable-ref ref=a value=7.4 offset=392025
  context: [[slot]]

## record-25 @ 635285

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | cosine | sine | special angles
- Counts: strings=42, variables=7, display=2, refs=3, slots=1, visibleChoices=0

```text
The expression cos [[slot]] is equivalent to sin ____________________.
```

Variables:
- angle = 30  rule: `range(30,60,15)`
- angleList = 60  rule: `if(angle=45,angleList1,angleList2)`
- angleList1 = 45  rule: `list(45)`
- angleList2 = 60  rule: `if(angle=30,angleList3,angleList4)`
- ANS_angle = 60  rule: `choose(angle,angleList)`
- angleList3 = 60  rule: `list(60)`
- angleList4 = 30  rule: `list(30)`

Inline slots:
- #1 variable-ref ref=angle value=30 offset=636303
  context: The expression cos [[slot]]

## record-26 @ 637925

- Metadata: Average | Section 2.2 | T 1 | Trigonometric Ratios of Any Angle | sine | reference angle
- Counts: strings=27, variables=2, display=4, refs=3, slots=1, visibleChoices=0

```text
An angle between 0 and 360 that has the same sine value as sin [[slot]] is ____________________.
```

Variables:
- angle = 133  rule: `rand(179)`
- ANS_angle = 47  rule: `180-angle`

Inline slots:
- #1 variable-ref ref=angle value=133 offset=638445
  context: that has the same sine value as sin [[slot]]

## record-27 @ 639997

- Metadata: Easy | Section 2.2 | T 2 | Trigonometric Ratios of Any Angle | ratio | quadrant
- Counts: strings=45, variables=4, display=10, refs=2, slots=2, visibleChoices=1
- Suspicious: slot-without-variable-ref

```text
list("second or 2nd") second or 2nd list("third or 3rd") third or 3rd [[slot]] list("fourth or 4th") fourth or 4th third or 3rd third or 3rd The [[slot]] ratio is positive in the first and ____________________ quadrants.
```

Choices:
- H. The [[slot]] ratio is positive in the first and ____________________ quadrants.

Variables:
- ratioList = sine, cosine, tangent  rule: `list("sine","cosine","tangent")`
- whichRatio = 3  rule: `rand(3)`
- Ratio = tangent  rule: `choose(whichRatio,ratioList)`
- tangent = ?  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=Ratio value=tangent offset=640801
  context: [[slot]]
- #2 unknown-object ref=- value=- offset=641323
  context: The [[slot]] ratio is positive in the first and ____________________ quadrants.

## record-28 @ 642953

- Metadata: Average | Section 2.3 | Section 2.4 | T 3 | The Sine Law | The Cosine Law | cosine law | sine law
- Counts: strings=35, variables=0, display=5, refs=2, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("an opposite","their contained") an opposite, their contained [[slot]] their contained The ____________________ law is used to solve a triangle when two sides and [[slot]] angle are given.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=643441
  context: [[slot]]
- #2 unknown-object ref=- value=- offset=643947
  context: The ____________________ law is used to solve a triangle when two sides and [[slot]] angle are given.

## record-29 @ 645477

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=112, variables=15, display=1, refs=23, slots=2, visibleChoices=0

```text
The sine law for acute [[slot]] states that [[slot]] ____________________.
```

Variables:
- angleList = P, Q, R  rule: `list("P","Q","R")`
- whichAngle = 2  rule: `rand(3)`
- angle = Q  rule: `choose(whichAngle,angleList)`
- sideList = p, q, r  rule: `list("p","q","r")`
- side = q  rule: `choose(whichAngle,sideList)`
- q = ?  rule: `[[slot]]`
- secondangleList = Q, R, P  rule: `list("Q","R","P")`
- secondangle = R  rule: `choose(whichAngle,secondangleList)`
- secondsideList = q, r, p  rule: `list("q","r","p")`
- secondside = r  rule: `choose(whichAngle,secondsideList)`
- thirdangleList = R, P, Q  rule: `list("R","P","Q")`
- thirdangle = P  rule: `choose(whichAngle,thirdangleList)`
- thirdsideList = r, p, q  rule: `list("r","p","q")`
- thirdside = p  rule: `choose(whichAngle,thirdsideList)`
- p = ?  rule: `<`

Inline slots:
- #1 variable-ref ref=angle value=Q offset=647255
  context: The sine law for acute [[slot]] states that [[slot]] ____________________.
- #2 variable-ref ref=side value=q offset=647283
  context: The sine law for acute [[slot]] states that [[slot]] ____________________.

## record-30 @ 650437

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | ambiguous case
- Counts: strings=12, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
a problem with two or more solutions
```

## record-31 @ 651491

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=12, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
a law used when two sides and an opposite angle are given
```

## record-32 @ 652575

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | reference angle
- Counts: strings=14, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
the acute angle between the terminal arm and the x-axis of an angle in standard position
```

## record-33 @ 653813

- Metadata: Easy | Section 2.1 | T 1 | Angles in Standard Position | standard angle
- Counts: strings=15, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
an angle with the initial arm on the positive x-axis
```

## record-34 @ 654977

- Metadata: Easy | Section 2.4 | T 3 | The Cosine Law | cosine law
- Counts: strings=11, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
a law used when two sides and a contained angle are given
```

## record-35 @ 656069

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | special angles | primary trigonometric ratios | area
- Counts: strings=115, variables=0, display=1, refs=21, slots=0, visibleChoices=0

```text
The hypotenuse of a right isosceles triangle is 5 cm long. a) Write an exact expression for the base and the height of the right triangle, using primary trigonometric ratios.b) Use your expressions to determine the exact area of the triangle.
```

## record-36 @ 672617

- Metadata: Difficult | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | special angles | primary trigonometric ratios | area
- Counts: strings=109, variables=0, display=2, refs=16, slots=0, visibleChoices=0

```text
A rectangle has a diagonal of 8 cm. The diagonal creates a 60 angle at the base of the rectangle. a) Write an exact expression for the base and the height of the rectangle.b) Use your expressions to find the exact area of the rectangle.
```

## record-37 @ 690495

- Metadata: Average | Section 2.2 | T 2 | Trigonometric Ratios of Any Angle | primary trigonometric ratios | point on terminal arm
- Counts: strings=48, variables=0, display=2, refs=12, slots=0, visibleChoices=0

```text
The point A(–3, –5) is on the terminal arm of an angle. Determine exact expressions for the primary trigonometric ratios for the angle.
```

## record-38 @ 693885

- Metadata: Average | Section 2.2 | T 2 | Trigonometric Ratios of Any Angle | primary trigonometric ratios
- Counts: strings=153, variables=0, display=2, refs=37, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given that [[slot]] and that A is located in the second quadrant, determine exact values for the other two primary trigonometric ratios.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=694145
  context: Given that [[slot]] and that

## record-39 @ 703427

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=105, variables=0, display=1, refs=16, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A survey of a plot of land is shown. The plot is to have a hedge along its border. How many linear metres of hedge are needed, to the nearest tenth of a metre?[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=703903
  context: its border. How many linear metres of hedge are needed, to the nearest tenth of a metre? [[slot]]

## record-40 @ 722684

- Metadata: Average | Section 2.3 | Section 2.4 | T 3 | The Sine Law | The Cosine Law | solve a triangle
- Counts: strings=14, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
What does it mean to solve a triangle? List some methods you could use to solve a triangle.
```

## record-41 @ 724644

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law | solve a triangle
- Counts: strings=157, variables=0, display=1, refs=50, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
In acute [[slot]], o = 7 cm, p = 9 cm, and [[slot]]. Solve [[slot]]. What type of triangle is this?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=724856
  context: In acute [[slot]], o = 7 cm, p = 9 cm, and [[slot]]. Solve [[slot]]. What type of triangle is this?
- #2 unknown-object ref=- value=- offset=724910
  context: In acute [[slot]], o = 7 cm, p = 9 cm, and [[slot]]. Solve [[slot]]. What type of triangle is this?
- #3 unknown-object ref=- value=- offset=724928
  context: In acute [[slot]], o = 7 cm, p = 9 cm, and [[slot]]. Solve [[slot]]. What type of triangle is this?

## record-42 @ 731533

- Metadata: Easy | Section 2.4 | T 3 | The Cosine Law | cosine law
- Counts: strings=55, variables=0, display=1, refs=12, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Let a = 6, b = 7, and [[slot]].Use the cosine law.[[slot]]The third side of the race course is approximately 4 km long.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=732539
  context: Let a = 6, b = 7, and [[slot]]. Use the cosine law. [[slot]] The third side of the race course is approximately 4 km lon
- #2 unknown-object ref=- value=- offset=732585
  context: Let a = 6, b = 7, and [[slot]]. Use the cosine law. [[slot]] The third side of the race course is approximately 4 km long.

## record-43 @ 735037

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law | angle measure
- Counts: strings=169, variables=0, display=1, refs=58, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A drive belt wraps around three pulleys, A, B, and C, as shown. [[slot]]What is the measure of [[slot]]?
```

Inline slots:
- #1 diagram-object ref=- value=- offset=735363
  context: A drive belt wraps around three pulleys, A, B, and C, as shown. [[slot]] What is the measure of [[slot]]?
- #2 diagram-object ref=- value=- offset=735413
  context: belt wraps around three pulleys, A, B, and C, as shown. [[slot]] What is the measure of [[slot]]?

## record-44 @ 786847

- Metadata: Easy | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | primary trigonometric ratios | reference angle
- Counts: strings=36, variables=0, display=4, refs=1, slots=0, visibleChoices=0

```text
a) For the given trigonometric ratio, determine two other angles that give the same value.i) sin 45 ii) tan 300 iii) cos 120 b) Explain how you determined the angles in part a).
```

## record-45 @ 790059

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | primary trigonometric ratios | reference angle
- Counts: strings=159, variables=0, display=7, refs=46, slots=0, visibleChoices=0

```text
The point (–5, 7) is located on the terminal arm of A in standard position. a) Determine the primary trigonometric ratios for A.b) Determine the primary trigonometric ratios for an B that has the same sine as A, but different signs for the other two primary trigonometric ratios.c) Use a calculator to determine the measures of A and B, to the nearest degree.
```

## record-46 @ 799420

- Metadata: Easy | Section 2.2 | T 2 | Trigonometric Ratios of Any Angle | sine | reference angle
- Counts: strings=1802, variables=0, display=3, refs=44, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Without using a calculator, determine two angles between 0 and 360 that have a sine ratio of [[slot]].b) Use a calculator and a diagram to verify your answers to part a).
```

Inline slots:
- #1 diagram-object ref=- value=- offset=799834
  context: that have a sine ratio of [[slot]]. b) Use a calculator and a diagram to verify your answers to part a).

## record-47 @ 1004052

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | primary trigonometric ratios | standard angle
- Counts: strings=1103, variables=0, display=1, refs=34, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A such that cos A = [[slot]].a) In which quadrant(s) is this angle? Explain.b) If the sine of the angle is negative, in which quadrant is the angle? Explain.c) Sketch a diagram to represent the angle in standard position, given that the condition in part b) is true.d) Find the coordinates of a point on the terminal arm of the angle.e) Write exact expressions for the other two primary trigonometric ratios for the angle.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1004484
  context: A such that cos A = [[slot]]. a) In which quadrant(s) is this angle? Explain. b) If the sine of the angle is negative,

## record-48 @ 1091596

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | primary trigonometric ratios | reference angle
- Counts: strings=1097, variables=1, display=2, refs=765, slots=0, visibleChoices=0

```text
A in standard position.d) Determine the measure of A in standard position, to the nearest degree.
```

Variables:
- In = ?  rule: `ABC,`

## record-49 @ 1240701

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | special angles | sine
- Counts: strings=306, variables=0, display=3, refs=26, slots=0, visibleChoices=0

```text
Two wires are connected to a tower at the same point on the tower. Wire 1 makes an angle of 45 with the ground and wire 2 makes an angle of 60 with the ground. a) Represent this situation with a diagram.b) Which wire is longer? Explain.c) If the point where the two wires connect to the tower is 35 m above the ground, determine exact expressions for the lengths of the two wires.d) Determine the length of each wire, to the nearest tenth of a metre.e) How do your answers to parts b) and d) compare?
```

## record-50 @ 1285248

- Metadata: Average | Section 2.1 | Section 2.2 | T 1 | T 2 | Angles in Standard Position | Trigonometric Ratios of Any Angle | primary trigonometric ratios | special angles
- Counts: strings=407, variables=0, display=4, refs=30, slots=0, visibleChoices=0

```text
Sarah and Simone are walking in a walk-a-thon down a straight street that leads to the finish line. At the same time, they both notice a tethered hot-air balloon directly over the finish line. Sarah sees that the angle from the ground to the balloon as 30, and Simone (who is 0.25 km closer to the finish line than Sarah) sees the angle from the ground to the balloon as 45.a) Draw a diagram to represent this situation.b) Let x represent the distance that Simone is from the finish line, and write an expression for the distance from Sarah to the finish line.c) Write a trigonometric ratio for each girl s position that involves the height, h, of the balloon, the distance each girl is away from the finish line, and the angle from the girl to the balloon.d) Rearrange each equation from part c) to isolate h.e) Set the two expressions for h equal to each other and solve for x, to the nearest hundredth of a kilometre.f) Determine the height of the balloon, to the nearest hundredth of a kilometre.
```

## record-51 @ 1358932

- Metadata: Difficult | Section 2.2 | T 3 | Trigonometric Ratios of Any Angle | tangent
- Counts: strings=293, variables=0, display=2, refs=59, slots=0, visibleChoices=0

```text
Gursant and Leo are both standing on the north side of a monument that is 6.0 m tall. Leo is standing 3.5 m closer to the monument than Gursant. Leo measures the angle from the ground to the top of the monument to be 41. Determine the angle that Gursant would measure from the ground to the top of the monument, to the nearest degree.
```

## record-52 @ 1406733

- Metadata: Difficult | Section 2.2 | T 2 | Trigonometric Ratios of Any Angle | primary trigonometric ratios
- Counts: strings=152, variables=0, display=1, refs=55, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
is an acute angle defined by a point P(x,y) in quadrant I. Use x and y to define the sine, cosine and tangent of each angle.a) [[slot]]b) [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1407233
  context: (x,y) in quadrant I. Use x and y to define the sine, cosine and tangent of each angle. a) [[slot]] b) [[slot]]
- #2 unknown-object ref=- value=- offset=1407243
  context: drant I. Use x and y to define the sine, cosine and tangent of each angle. a) [[slot]] b) [[slot]]

## record-53 @ 1414807

- Metadata: Average | Section 2.3 | Section 2.4 | T 2 | T 3 | Trigonometric Ratios of Any Angle | The Sine Law | sine law
- Counts: strings=68, variables=0, display=3, refs=21, slots=0, visibleChoices=0

```text
An airplane is flying over the town of Colonsay, between two tracking stations. The angle of elevation from Station 1 is 36 and from Station 2 is 48. If the stations are 1675 m apart, what is the altitude of the plane, to the nearest tenth of a metre?
```

## record-54 @ 1419224

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law | ambiguous case
- Counts: strings=471, variables=0, display=1, refs=77, slots=0, visibleChoices=0

```text
A in each diagram.d) Calculate the length of BC in each diagram.
```

## record-55 @ 1491279

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=161, variables=0, display=4, refs=42, slots=0, visibleChoices=0

```text
A salvage vessel locates a sunken ship directly below it. The angle of depression from the salvage vessel to one end of the ship is 29.3 and to the other end is 47.5. If the length of the ship is 143 m, determine how far beneath the water s surface it is, to the nearest metre.
```

## record-56 @ 1556726

- Metadata: Easy | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=33, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Let h represent the height of the totem pole, in metres.[[slot]]The totem pole is approximately 56.4 m tall.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1557902
  context: Let h represent the height of the totem pole, in metres. [[slot]] The totem pole is approximately 56.4 m tall.

## record-57 @ 1559490

- Metadata: Average | Section 2.3 | T 3 | The Sine Law | sine law
- Counts: strings=269, variables=5, display=5, refs=33, slots=0, visibleChoices=0

```text
The Cosine Law cosine law Jason is standing 8.7 km from town X and 11.5 km from town Y. From where he stands, the angle between the two towns is 37. A new hotel has just been built on the road connecting town X and town Y, exactly halfway between the two towns. From where Jason is standing, he sees that the angle of elevation to the top of the hotel is 1. Determine the height of the hotel, to the nearest tenth of a metre. Include a diagram with your solution.
```

Variables:
- x = ?  rule: `;`
- d = ?  rule: `-`
- b = 9  rule: `0`
- a = 4  rule: `0`
- p = Section 2.4  rule: `Difficult +`

## record-58 @ 1583253

- Metadata: Difficult | Section 2.4 | T 3 | The Cosine Law | cosine law
- Counts: strings=75, variables=0, display=1, refs=20, slots=0, visibleChoices=0

```text
A clock has two hands that are 12 cm and 15 cm long. What is the distance, to the nearest tenth of a centimetre, between the tips of the hands at 2 p.m.?
```

## record-59 @ 1587755

- Metadata: Average | Section 2.4 | T 3 | The Cosine Law | cosine law
- Counts: strings=97, variables=0, display=2, refs=20, slots=0, visibleChoices=0

```text
A racing bicycle has spokes on each wheel that are 35 cm long. Each spoke forms a 30 angle with the adjacent spoke. What is the distance between the points where the spokes attach to the wheel, rounded to the nearest centimetre?
```

## record-60 @ 1595541

- Metadata: Average | Section 2.3 | Section 2.4 | T 3 | The Sine Law | The Cosine Law | cosine law | sine law
- Counts: strings=558, variables=0, display=2, refs=69, slots=0, visibleChoices=0

```text
Chang is participating in a charity bicycle road race. The route starts at Centreville and travels east for 13 km to Eastdale. He then makes a 135 turn and heads northwest for another 18 km, arriving at Northcote. The final leg of the race returns to Centreville.a) What is the total length of the race, to the nearest tenth of a kilometre?b) What are the angles in the triangle formed by the three towns, to the nearest degree?
```

