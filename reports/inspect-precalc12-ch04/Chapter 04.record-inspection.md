# Record Inspection: Chapter 04.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 04.bnk`
- Inflated bytes: 1545151
- Records: 60
- Inline slots: 680
- Slot classes: variable-ref=465, unknown-object=209, fixed-value=3, math-object=2, diagram-object=1

## record-1 @ 4628

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radians | degrees
- Counts: strings=112, variables=5, display=16, refs=11, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
int(ans) and abs(num)<>abs(den) ans+90 330 ans-90 150 ans+180 420 [[slot]][[slot]] radians is equal to how many degrees? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]][[slot]] radians is equal to how many degrees?
- D. [[slot]]

Variables:
- num = 4  rule: `range(1,6,1)`
- rads = 4/3  rule: `fracs(num,den)`
- ans = 240  rule: `(c*180)`
- den = 3  rule: `range(2,6,1)`
- c = 1.333333333333  rule: `num/den`

Inline slots:
- #1 variable-ref ref=rads value=4/3 offset=5632
  context: [[slot]][[slot]] radians is equal to how many degrees?
- #2 variable-ref ref=ans value=240 offset=5634
  context: [[slot]][[slot]] radians is equal to how many degrees?
- #3 unknown-object ref=- value=- offset=5720
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=5732
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=5746
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=5758
  context: [[slot]]

## record-2 @ 8563

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radians | degrees
- Counts: strings=162, variables=6, display=9, refs=30, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The exact radian measure for an angle of [[slot]] A. [[slot]][[slot]] C. [[slot]][[slot]] B. [[slot]][[slot]] D. [[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]]
- B. [[slot]][[slot]]
- C. [[slot]][[slot]]
- D. [[slot]][[slot]]

Variables:
- x = 17  rule: `range(1,24,1)`
- degrees = 255  rule: `x*15`
- rads_ans = 17/12  rule: `fracs(degrees,180)`
- dis_1 = 12/17  rule: `fracs(180,degrees)`
- dis_2 = 17/6  rule: `fracs(degrees,90)`
- dis_3 = 6/17  rule: `fracs(90,degrees)`

Inline slots:
- #1 variable-ref ref=degrees value=255 offset=9599
  context: The exact radian measure for an angle of [[slot]]
- #2 variable-ref ref=rads_ans value=17/12 offset=9617
  context: [[slot]][[slot]]
- #3 variable-ref ref=dis_2 value=17/6 offset=9619
  context: [[slot]][[slot]]
- #4 variable-ref ref=dis_1 value=12/17 offset=9629
  context: [[slot]][[slot]]
- #5 variable-ref ref=dis_3 value=6/17 offset=9631
  context: [[slot]][[slot]]
- #6 unknown-object ref=- value=- offset=9643
  context: [[slot]][[slot]]
- #7 unknown-object ref=- value=- offset=9645
  context: [[slot]][[slot]]
- #8 unknown-object ref=- value=- offset=9655
  context: [[slot]][[slot]]
- #9 unknown-object ref=- value=- offset=9657
  context: [[slot]][[slot]]

## record-3 @ 13951

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | radians | degrees
- Counts: strings=117, variables=8, display=9, refs=22, slots=6, visibleChoices=4

```text
Which of the following angles, in degrees, is coterminal with, but not equal to, [[slot]][[slot]] radians? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 6  rule: `range(1,6,1)`
- rads = 6/5  rule: `fracs(num,den)`
- deg_ans = 216  rule: `(c*180)`
- den = 5  rule: `range(2,6,1)`
- c = 1.2  rule: `num/den`
- dis_1 = 396  rule: `deg_ans+180`
- dis_2 = 486  rule: `deg_ans+270`
- ans = 576  rule: `deg_ans+360`

Inline slots:
- #1 variable-ref ref=c value=1.2 offset=15133
  context: Which of the following angles, in degrees, is coterminal with, but not equal to, [[slot]][[slot]] radians?
- #2 variable-ref ref=rads value=6/5 offset=15135
  context: Which of the following angles, in degrees, is coterminal with, but not equal to, [[slot]][[slot]] radians?
- #3 variable-ref ref=dis_1 value=396 offset=15163
  context: [[slot]]
- #4 variable-ref ref=dis_2 value=486 offset=15175
  context: [[slot]]
- #5 variable-ref ref=ans value=576 offset=15189
  context: [[slot]]
- #6 variable-ref ref=deg_ans value=216 offset=15201
  context: [[slot]]

## record-4 @ 18054

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radians | degrees
- Counts: strings=101, variables=9, display=9, refs=13, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Determine the arc length of a circle with radius [[slot]] cm if it is subtended by a central angle of [[slot]][[slot]] radians. Round your answer to one decimal place. A. [[slot]] cm C. [[slot]] cm B. [[slot]] cm D. [[slot]] cm
```

Choices:
- A. [[slot]] cm
- B. [[slot]] cm
- C. [[slot]] cm
- D. [[slot]] cm

Variables:
- num = 5  rule: `range(1,6,1)`
- rads = 5/2  rule: `fracs(num,den)`
- ans = 43.2  rule: `((num/den)*pi)*r`
- den = 2  rule: `range(1,6,1)`
- c = 2.5  rule: `num/den`
- r = 5.5  rule: `range(1,10,0.1)`
- dis_1 = 4.4  rule: `((num/den)/pi)*r`
- dis_2 = 1.4  rule: `((num/den)*pi)/r`
- dis_3 = 6.9  rule: `((den/num)*pi)*r`

Inline slots:
- #1 variable-ref ref=r value=5.5 offset=19296
  context: Determine the arc length of a circle with radius [[slot]] cm if it is subtended by a central angle of [[slot]][[slot]] radians. Round your answer t
- #2 variable-ref ref=rads value=5/2 offset=19388
  context: e arc length of a circle with radius [[slot]] cm if it is subtended by a central angle of [[slot]][[slot]] radians. Round your answer to one decimal place.
- #3 variable-ref ref=dis_2 value=1.4 offset=19390
  context: ngth of a circle with radius [[slot]] cm if it is subtended by a central angle of [[slot]][[slot]] radians. Round your answer to one decimal place.
- #4 variable-ref ref=dis_1 value=4.4 offset=19498
  context: [[slot]] cm
- #5 variable-ref ref=ans value=43.2 offset=19514
  context: [[slot]] cm
- #6 variable-ref ref=dis_3 value=6.9 offset=19532
  context: [[slot]] cm
- #7 fixed-value ref=- value=- offset=19548
  context: [[slot]] cm

## record-5 @ 22569

- Metadata: Easy | Section 4.2 | T2 | Unit Circle | unit circle | unit circle equation
- Counts: strings=226, variables=3, display=9, refs=42, slots=5, visibleChoices=4

```text
Determine the equation of a circle with centre at the origin and radius [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- radius = 8  rule: `range(3,10,1)`
- radius_sq = 64  rule: `radius^2`
- radius_double = 16  rule: `radius+radius`

Inline slots:
- #1 variable-ref ref=radius value=8 offset=23255
  context: Determine the equation of a circle with centre at the origin and radius [[slot]].
- #2 variable-ref ref=radius_double value=16 offset=23267
  context: [[slot]]
- #3 variable-ref ref=radius value=8 offset=23277
  context: [[slot]]
- #4 variable-ref ref=radius_sq value=64 offset=23289
  context: [[slot]]
- #5 variable-ref ref=radius value=8 offset=23299
  context: [[slot]]

## record-6 @ 31337

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radians
- Counts: strings=260, variables=15, display=10, refs=23, slots=5, visibleChoices=5

```text
Which graph represents an angle in standard position with a measure of [[slot]] rad? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. _

Variables:
- denom = 8  rule: `range(2,12,1)`
- num_max = 15  rule: `2*denom-1`
- num = 5  rule: `range(1,num_max,1)`
- angle = 1.963495408494  rule: `(num*pi)/denom`
- x_pt = –1.913417161825  rule: `5*cos(Angle)`
- y_pt = 4.619397662556  rule: `5*sin(Angle)`
- A_dis1 = 3.534291735289  rule: `if((Angle+(pi/2))>(2*pi),Angle-(3*pi/2),Angle+(pi/2))`
- A_dis2 = 0.392699081699  rule: `if((Angle-(pi/2))<0,Angle+(3*pi/2),Angle-(pi/2))`
- A_dis3 = 5.105088062083  rule: `if((Angle+pi)>(2*pi),Angle-pi,Angle+pi)`
- x_pt1 = –4.619397662556  rule: `5*cos(A_dis1)`
- y_pt1 = –1.913417161825  rule: `5*sin(A_dis1)`
- x_pt2 = 4.619397662556  rule: `5*cos(A_dis2)`
- y_pt2 = 1.913417161825  rule: `5*sin(A_dis2)`
- x_pt3 = 1.913417161825  rule: `5*cos(A_dis3)`
- y_pt3 = –4.619397662556  rule: `5*sin(A_dis3)`

Inline slots:
- #1 variable-ref ref=x_pt2 value=4.619397662556 offset=33597
  context: Which graph represents an angle in standard position with a measure of [[slot]]
- #2 variable-ref ref=y_pt2 value=1.913417161825 offset=33619
  context: [[slot]]
- #3 variable-ref ref=x_pt3 value=1.913417161825 offset=33629
  context: [[slot]]
- #4 variable-ref ref=y_pt3 value=–4.619397662556 offset=33641
  context: [[slot]]
- #5 variable-ref ref=x_pt value=–1.913417161825 offset=33651
  context: [[slot]]

## record-7 @ 88695

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | degrees
- Counts: strings=251, variables=13, display=9, refs=18, slots=5, visibleChoices=5

```text
Which graph represents an angle in standard position with a measure of [[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. ^

Variables:
- degrees = range(15,345,15)  rule: `A`
- Angle = 2.356194490192  rule: `A*pi/180`
- x_pt = –3.535533905933  rule: `5*cos(Angle)`
- y_pt = 3.535533905933  rule: `5*sin(Angle)`
- A_dis1 = 3.926990816987  rule: `if((Angle+(pi/2))>(2*pi),Angle-(3*pi/2),Angle+(pi/2))`
- A_dis2 = 0.785398163397  rule: `if((Angle-(pi/2))<0,Angle+(3*pi/2),Angle-(pi/2))`
- A_dis3 = 5.497787143782  rule: `if((Angle+pi)>(2*pi),Angle-pi,Angle+pi)`
- x_pt1 = –3.535533905933  rule: `5*cos(A_dis1)`
- y_pt1 = –3.535533905933  rule: `5*sin(A_dis1)`
- x_pt2 = 3.535533905933  rule: `5*cos(A_dis2)`
- y_pt2 = 3.535533905933  rule: `5*sin(A_dis2)`
- x_pt3 = 3.535533905933  rule: `5*cos(A_dis3)`
- y_pt3 = –3.535533905933  rule: `5*sin(A_dis3)`

Inline slots:
- #1 variable-ref ref=x_pt1 value=–3.535533905933 offset=90683
  context: Which graph represents an angle in standard position with a measure of [[slot]]
- #2 variable-ref ref=y_pt1 value=–3.535533905933 offset=90697
  context: [[slot]]
- #3 variable-ref ref=x_pt3 value=3.535533905933 offset=90707
  context: [[slot]]
- #4 variable-ref ref=y_pt3 value=–3.535533905933 offset=90719
  context: [[slot]]
- #5 variable-ref ref=x_pt2 value=3.535533905933 offset=90729
  context: [[slot]]

## record-8 @ 145863

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radians
- Counts: strings=96, variables=9, display=9, refs=11, slots=5, visibleChoices=4

```text
Determine the measure of the angle in standard position shown on the graph below. Round your answer to the nearest tenth of a degree.[[slot]] A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- x_pt = 1  rule: `range(-5,5,1)`
- y_pt = 3  rule: `range(-5,5,1)`
- Angle = 1.249045772398  rule: `atan(y_pt/x_pt)`
- ans = 71.6  rule: `if(x_pt>0 and y_pt>0,A,if(x_pt<0 and y_pt>0,180+A,if(x_pt<0 and y_pt<0,180+A,360+A)))`
- A_dis1 = 161.6  rule: `if((ans+90)>360,ans-270,ans+90)`
- A_dis2 = 341.6  rule: `if((ans-90)<0,ans+270,ans-90)`
- A_dis3 = 251.6  rule: `if((ans+180)>360,ans-180,ans+180)`
- ansr = 1.249045772398  rule: `ans*pi/180`
- cosA = 0.316227766017  rule: `cos(Angle)`

Inline slots:
- #1 variable-ref ref=x_pt value=1 offset=147577
  context: rd position shown on the graph below. Round your answer to the nearest tenth of a degree. [[slot]]
- #2 variable-ref ref=y_pt value=3 offset=147589
  context: [[slot]]
- #3 variable-ref ref=x_pt value=1 offset=147601
  context: [[slot]]
- #4 variable-ref ref=y_pt value=3 offset=147615
  context: [[slot]]
- #5 variable-ref ref=A_dis1 value=161.6 offset=147627
  context: [[slot]]

## record-9 @ 156231

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | angle | radians | arc length
- Counts: strings=69, variables=6, display=9, refs=6, slots=6, visibleChoices=4

```text
John cuts a slice from a circular ice cream cake with a diameter of [[slot]] cm. His slice is in the shape of a sector with an arc length of [[slot]] cm. What is the measure of the central angle of the slice, in radians? Round your answer to two decimal places, if necessary. A. [[slot]] rad C. [[slot]] rad B. [[slot]] rad D. [[slot]] rad
```

Choices:
- A. [[slot]] rad
- B. [[slot]] rad
- C. [[slot]] rad
- D. [[slot]] rad

Variables:
- cakesector = 7  rule: `range(3,10,1)`
- cakediam = 24  rule: `range(22,32,2)`
- ans = 0.58  rule: `cakesector/(cakediam/2)`
- dis_1 = 0.29  rule: `cakesector/cakediam`
- dis_2 = 1.71  rule: `(cakediam/2)/cakesector`
- dis_3 = 3.43  rule: `cakediam/cakesector`

Inline slots:
- #1 variable-ref ref=cakediam value=24 offset=157265
  context: John cuts a slice from a circular ice cream cake with a diameter of [[slot]] cm. His slice is in the shape of a sector with an arc length of [[slot]] cm. What is the
- #2 variable-ref ref=cakesector value=7 offset=157397
  context: th a diameter of [[slot]] cm. His slice is in the shape of a sector with an arc length of [[slot]] cm. What is the measure of the central angle of the slice, in radians? Round your answer
- #3 variable-ref ref=dis_2 value=1.71 offset=157659
  context: [[slot]] rad
- #4 variable-ref ref=dis_1 value=0.29 offset=157677
  context: [[slot]] rad
- #5 variable-ref ref=dis_3 value=3.43 offset=157697
  context: [[slot]] rad
- #6 variable-ref ref=ans value=0.58 offset=157715
  context: [[slot]] rad

## record-10 @ 160241

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | trigonometric ratios | unit circle | terminal arm | angle
- Counts: strings=81, variables=5, display=9, refs=12, slots=9, visibleChoices=4

```text
The coordinates of the point that lies at the intersection of the terminal arm and the unit circle at an angle of [[slot]] A. ([[slot]], [[slot]]) C. ([[slot]], [[slot]]) B. ([[slot]], [[slot]]) D. ([[slot]], [[slot]])
```

Choices:
- A. ([[slot]], [[slot]])
- B. ([[slot]], [[slot]])
- C. ([[slot]], [[slot]])
- D. ([[slot]], [[slot]])

Variables:
- degrees = 110  rule: `rand(360)`
- ans_x = –0.34  rule: `cos(radians)`
- ans_y = 0.94  rule: `sin(radians)`
- dis_1 = –2.75  rule: `tan(radians)`
- radians = 1.919862177194  rule: `degrees*pi/180`

Inline slots:
- #1 variable-ref ref=degrees value=110 offset=161277
  context: oint that lies at the intersection of the terminal arm and the unit circle at an angle of [[slot]]
- #2 variable-ref ref=ans_y value=0.94 offset=161299
  context: ([[slot]], [[slot]])
- #3 variable-ref ref=ans_x value=–0.34 offset=161305
  context: ([[slot]], [[slot]])
- #4 variable-ref ref=ans_x value=–0.34 offset=161319
  context: ([[slot]], [[slot]])
- #5 variable-ref ref=ans_y value=0.94 offset=161325
  context: ([[slot]], [[slot]])
- #6 variable-ref ref=ans_x value=–0.34 offset=161341
  context: ([[slot]], [[slot]])
- #7 variable-ref ref=dis_1 value=–2.75 offset=161347
  context: ([[slot]], [[slot]])
- #8 variable-ref ref=dis_1 value=–2.75 offset=161361
  context: ([[slot]], [[slot]])
- #9 variable-ref ref=ans_y value=0.94 offset=161367
  context: ([[slot]], [[slot]])

## record-11 @ 164403

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | exact value | unit circle
- Counts: strings=1334, variables=54, display=10, refs=410, slots=137, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Identify the point on the unit circle corresponding to an angle of [[slot]] in standard position. A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
```

Choices:
- A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])

Variables:
- e = ?  rule: `O`
- deg_list = 0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360  rule: `list("0","30","45","60","90","120","135","150","180","210","225","240","270","300","315","330","360")`
- select_deg_list = 300  rule: `choose(which,deg_list)`
- eq1 = 0  rule: `if(which=1,true,false)`
- eq2 = 0  rule: `if(which=2,true,false)`
- eq3 = 0  rule: `if(which=3,true,false)`
- eq4 = 0  rule: `if(which=4,true,false)`
- eq5 = 0  rule: `if(which=5,true,false)`
- eq6 = 0  rule: `if(which=6,true,false)`
- eq7 = 0  rule: `if(which=7,true,false)`
- eq8 = 0  rule: `if(which=8,true,false)`
- eq9 = 0  rule: `if(which=9,true,false)`
- eq10 = 0  rule: `if(which=10,true,false)`
- eq11 = 0  rule: `if(which=11,true,false)`
- eq12 = 0  rule: `if(which=12,true,false)`
- eq13 = 0  rule: `if(which=13,true,false)`
- eq14 = 1  rule: `if(which=14,true,false)`
- eq15 = 0  rule: `if(which=15,true,false)`
- eq16 = 0  rule: `if(which=16,true,false)`
- eq17 = 0  rule: `if(which=17,true,false)`
- xdisp1 = 0  rule: `if(which=1,true,false)`
- xdisp2 = 0  rule: `if(which=2,true,false)`
- xdisp3 = 0  rule: `if(which=3,true,false)`
- xdisp4 = 0  rule: `if(which=4,true,false)`

Inline slots:
- #1 variable-ref ref=e value=O offset=170827
  context: Identify the point on the unit circle corresponding to an angle of [[slot]]
- #2 variable-ref ref=e value=O offset=170887
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #3 variable-ref ref=select_deg_list value=300 offset=170889
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #4 variable-ref ref=eq2 value=0 offset=170891
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #5 variable-ref ref=eq4 value=0 offset=170893
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #6 variable-ref ref=eq6 value=0 offset=170895
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #7 variable-ref ref=eq8 value=0 offset=170897
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #8 variable-ref ref=eq10 value=0 offset=170899
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #9 variable-ref ref=eq12 value=0 offset=170901
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #10 variable-ref ref=eq14 value=1 offset=170903
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #11 variable-ref ref=eq16 value=0 offset=170905
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #12 variable-ref ref=ydisp2 value=0 offset=170907
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #13 variable-ref ref=ydisp3 value=0 offset=170909
  context: ( [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #14 variable-ref ref=ydisp4 value=0 offset=170911
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #15 variable-ref ref=ydisp6 value=0 offset=170913
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #16 variable-ref ref=ydisp7 value=0 offset=170915
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #17 variable-ref ref=ydisp8 value=0 offset=170917
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #18 variable-ref ref=ydisp10 value=0 offset=170919
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #19 variable-ref ref=ydisp11 value=0 offset=170925
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #20 variable-ref ref=ydisp12 value=0 offset=170927
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #21 variable-ref ref=ydisp14 value=1 offset=170929
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #22 variable-ref ref=ydisp15 value=0 offset=170931
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #23 variable-ref ref=ydisp16 value=0 offset=170933
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #24 variable-ref ref=xdisp2 value=0 offset=170935
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #25 variable-ref ref=xdisp3 value=0 offset=170937
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #26 variable-ref ref=xdisp4 value=0 offset=170939
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #27 variable-ref ref=xdisp6 value=0 offset=170941
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #28 variable-ref ref=xdisp7 value=0 offset=170943
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #29 variable-ref ref=xdisp8 value=0 offset=170945
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #30 variable-ref ref=xdisp10 value=0 offset=170947
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #31 variable-ref ref=xdisp11 value=0 offset=170949
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #32 variable-ref ref=xdisp12 value=0 offset=170951
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #33 variable-ref ref=xdisp14 value=1 offset=170953
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #34 variable-ref ref=xdisp15 value=0 offset=170955
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #35 variable-ref ref=xdisp16 value=0 offset=170957
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #36 variable-ref ref=ydisp2 value=0 offset=170971
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #37 variable-ref ref=ydisp3 value=0 offset=170973
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #38 variable-ref ref=ydisp4 value=0 offset=170975
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #39 variable-ref ref=ydisp6 value=0 offset=170977
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #40 variable-ref ref=ydisp7 value=0 offset=170979
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #41 variable-ref ref=ydisp8 value=0 offset=170981
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #42 variable-ref ref=ydisp10 value=0 offset=170983
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #43 variable-ref ref=ydisp11 value=0 offset=170985
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #44 variable-ref ref=ydisp12 value=0 offset=170987
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #45 variable-ref ref=ydisp14 value=1 offset=170989
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #46 variable-ref ref=ydisp15 value=0 offset=170991
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #47 variable-ref ref=ydisp16 value=0 offset=170993
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #48 variable-ref ref=ydisp2 value=0 offset=170995
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #49 variable-ref ref=ydisp3 value=0 offset=170997
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #50 variable-ref ref=ydisp4 value=0 offset=170999
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #51 variable-ref ref=ydisp6 value=0 offset=171001
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #52 variable-ref ref=ydisp7 value=0 offset=171003
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #53 variable-ref ref=ydisp8 value=0 offset=171009
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #54 variable-ref ref=ydisp10 value=0 offset=171011
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #55 variable-ref ref=ydisp11 value=0 offset=171013
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #56 variable-ref ref=ydisp12 value=0 offset=171015
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #57 variable-ref ref=ydisp14 value=1 offset=171017
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #58 variable-ref ref=ydisp15 value=0 offset=171019
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #59 variable-ref ref=ydisp16 value=0 offset=171021
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #60 variable-ref ref=xdisp2 value=0 offset=171023
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #61 variable-ref ref=xdisp3 value=0 offset=171025
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #62 variable-ref ref=xdisp4 value=0 offset=171027
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #63 variable-ref ref=xdisp6 value=0 offset=171029
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #64 variable-ref ref=xdisp7 value=0 offset=171031
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #65 variable-ref ref=xdisp8 value=0 offset=171033
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #66 variable-ref ref=xdisp10 value=0 offset=171035
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #67 variable-ref ref=xdisp11 value=0 offset=171037
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #68 variable-ref ref=xdisp12 value=0 offset=171039
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #69 variable-ref ref=xdisp14 value=1 offset=171041
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #70 variable-ref ref=xdisp15 value=0 offset=171057
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #71 variable-ref ref=xdisp16 value=0 offset=171059
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #72 variable-ref ref=xdisp2 value=0 offset=171061
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #73 variable-ref ref=xdisp3 value=0 offset=171063
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #74 variable-ref ref=xdisp4 value=0 offset=171065
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #75 variable-ref ref=xdisp6 value=0 offset=171067
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #76 variable-ref ref=xdisp7 value=0 offset=171069
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #77 variable-ref ref=xdisp8 value=0 offset=171071
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #78 variable-ref ref=xdisp10 value=0 offset=171073
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #79 variable-ref ref=xdisp11 value=0 offset=171075
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #80 variable-ref ref=xdisp12 value=0 offset=171077
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #81 variable-ref ref=xdisp14 value=1 offset=171079
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #82 variable-ref ref=xdisp15 value=0 offset=171081
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #83 variable-ref ref=xdisp16 value=0 offset=171083
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #84 variable-ref ref=eq2 value=0 offset=171085
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #85 variable-ref ref=eq4 value=0 offset=171087
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #86 variable-ref ref=eq6 value=0 offset=171089
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #87 variable-ref ref=eq8 value=0 offset=171095
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #88 variable-ref ref=eq10 value=0 offset=171097
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #89 variable-ref ref=eq12 value=0 offset=171099
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #90 variable-ref ref=eq14 value=1 offset=171101
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #91 variable-ref ref=eq16 value=0 offset=171103
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #92 unknown-object ref=- value=- offset=171105
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #93 unknown-object ref=- value=- offset=171107
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #94 unknown-object ref=- value=- offset=171109
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #95 unknown-object ref=- value=- offset=171111
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #96 unknown-object ref=- value=- offset=171113
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #97 unknown-object ref=- value=- offset=171115
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #98 unknown-object ref=- value=- offset=171117
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #99 unknown-object ref=- value=- offset=171119
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #100 unknown-object ref=- value=- offset=171121
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #101 unknown-object ref=- value=- offset=171123
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #102 unknown-object ref=- value=- offset=171125
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #103 unknown-object ref=- value=- offset=171127
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #104 unknown-object ref=- value=- offset=171141
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #105 unknown-object ref=- value=- offset=171143
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #106 unknown-object ref=- value=- offset=171145
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #107 unknown-object ref=- value=- offset=171147
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #108 unknown-object ref=- value=- offset=171149
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #109 unknown-object ref=- value=- offset=171151
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #110 unknown-object ref=- value=- offset=171153
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #111 unknown-object ref=- value=- offset=171155
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #112 unknown-object ref=- value=- offset=171157
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #113 unknown-object ref=- value=- offset=171159
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #114 unknown-object ref=- value=- offset=171161
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #115 unknown-object ref=- value=- offset=171163
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #116 unknown-object ref=- value=- offset=171165
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #117 unknown-object ref=- value=- offset=171167
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #118 unknown-object ref=- value=- offset=171169
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #119 unknown-object ref=- value=- offset=171171
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #120 unknown-object ref=- value=- offset=171173
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #121 unknown-object ref=- value=- offset=171179
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #122 unknown-object ref=- value=- offset=171181
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #123 unknown-object ref=- value=- offset=171183
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #124 unknown-object ref=- value=- offset=171185
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #125 unknown-object ref=- value=- offset=171187
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #126 unknown-object ref=- value=- offset=171189
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #127 unknown-object ref=- value=- offset=171191
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #128 unknown-object ref=- value=- offset=171193
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #129 unknown-object ref=- value=- offset=171195
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #130 unknown-object ref=- value=- offset=171197
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #131 unknown-object ref=- value=- offset=171199
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #132 unknown-object ref=- value=- offset=171201
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #133 unknown-object ref=- value=- offset=171203
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #134 unknown-object ref=- value=- offset=171205
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #135 unknown-object ref=- value=- offset=171207
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #136 unknown-object ref=- value=- offset=171209
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #137 unknown-object ref=- value=- offset=171211
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])

## record-12 @ 218446

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | exact value | unit circle | radians
- Counts: strings=1688, variables=68, display=9, refs=550, slots=153, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Identify the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position. A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
```

Choices:
- A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])

Variables:
- eq1 = 0  rule: `if(which=1,true,false)`
- eq2 = 0  rule: `if(which=2,true,false)`
- eq3 = 0  rule: `if(which=3,true,false)`
- eq4 = 0  rule: `if(which=4,true,false)`
- eq5 = 0  rule: `if(which=5,true,false)`
- eq6 = 0  rule: `if(which=6,true,false)`
- eq7 = 0  rule: `if(which=7,true,false)`
- eq8 = 0  rule: `if(which=8,true,false)`
- eq9 = 0  rule: `if(which=9,true,false)`
- eq10 = 0  rule: `if(which=10,true,false)`
- eq11 = 0  rule: `if(which=11,true,false)`
- eq12 = 1  rule: `if(which=12,true,false)`
- eq13 = 0  rule: `if(which=13,true,false)`
- eq14 = 0  rule: `if(which=14,true,false)`
- eq15 = 0  rule: `if(which=15,true,false)`
- eq16 = 0  rule: `if(which=16,true,false)`
- eq17 = 0  rule: `if(which=17,true,false)`
- xdisp1 = 0  rule: `if(which=1,true,false)`
- xdisp2 = 0  rule: `if(which=2,true,false)`
- xdisp3 = 0  rule: `if(which=3,true,false)`
- xdisp4 = 0  rule: `if(which=4,true,false)`
- xdisp5 = 0  rule: `if(which=5,true,false)`
- xdisp6 = 0  rule: `if(which=6,true,false)`
- xdisp7 = 0  rule: `if(which=7,true,false)`

Inline slots:
- #1 variable-ref ref=rad2 value=0 offset=226066
  context: Identify the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #2 variable-ref ref=rad3 value=0 offset=226068
  context: Identify the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #3 variable-ref ref=rad4 value=0 offset=226070
  context: Identify the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #4 variable-ref ref=rad5 value=0 offset=226072
  context: dentify the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #5 variable-ref ref=rad6 value=0 offset=226074
  context: the point on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #6 variable-ref ref=rad7 value=0 offset=226076
  context: t on the unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] r
- #7 variable-ref ref=rad8 value=0 offset=226078
  context: unit circle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians i
- #8 variable-ref ref=rad10 value=0 offset=226080
  context: rcle corresponding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standa
- #9 variable-ref ref=rad11 value=0 offset=226082
  context: responding to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard posit
- #10 variable-ref ref=rad12 value=1 offset=226084
  context: ng to an angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #11 variable-ref ref=rad13 value=0 offset=226086
  context: angle of [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #12 variable-ref ref=rad14 value=0 offset=226088
  context: f [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #13 variable-ref ref=rad15 value=0 offset=226090
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #14 variable-ref ref=rad16 value=0 offset=226092
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #15 variable-ref ref=ydisp2 value=0 offset=226094
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #16 variable-ref ref=ydisp3 value=0 offset=226096
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #17 variable-ref ref=ydisp4 value=0 offset=226098
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] radians in standard position.
- #18 variable-ref ref=ydisp6 value=0 offset=226170
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #19 variable-ref ref=ydisp7 value=0 offset=226172
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #20 variable-ref ref=ydisp8 value=0 offset=226174
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #21 variable-ref ref=ydisp10 value=0 offset=226176
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #22 variable-ref ref=ydisp11 value=0 offset=226178
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #23 variable-ref ref=ydisp12 value=1 offset=226180
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #24 variable-ref ref=ydisp14 value=0 offset=226182
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #25 variable-ref ref=ydisp15 value=0 offset=226184
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #26 variable-ref ref=ydisp16 value=0 offset=226186
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #27 variable-ref ref=xdisp2 value=0 offset=226188
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #28 variable-ref ref=xdisp3 value=0 offset=226190
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #29 variable-ref ref=xdisp4 value=0 offset=226192
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #30 variable-ref ref=xdisp6 value=0 offset=226194
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #31 variable-ref ref=xdisp7 value=0 offset=226196
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #32 variable-ref ref=xdisp8 value=0 offset=226198
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #33 variable-ref ref=xdisp10 value=0 offset=226200
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #34 variable-ref ref=xdisp11 value=0 offset=226202
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #35 variable-ref ref=xdisp12 value=1 offset=226208
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #36 variable-ref ref=xdisp14 value=0 offset=226210
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #37 variable-ref ref=xdisp15 value=0 offset=226212
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #38 variable-ref ref=xdisp16 value=0 offset=226214
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #39 variable-ref ref=xdisp2 value=0 offset=226216
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #40 variable-ref ref=xdisp3 value=0 offset=226218
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #41 variable-ref ref=xdisp4 value=0 offset=226220
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #42 variable-ref ref=xdisp6 value=0 offset=226222
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #43 variable-ref ref=xdisp7 value=0 offset=226224
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #44 variable-ref ref=xdisp8 value=0 offset=226226
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #45 variable-ref ref=xdisp10 value=0 offset=226228
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #46 variable-ref ref=xdisp11 value=0 offset=226230
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #47 variable-ref ref=xdisp12 value=1 offset=226232
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #48 variable-ref ref=xdisp14 value=0 offset=226234
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #49 variable-ref ref=xdisp15 value=0 offset=226236
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #50 variable-ref ref=xdisp16 value=0 offset=226238
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #51 variable-ref ref=ydisp2 value=0 offset=226240
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #52 variable-ref ref=ydisp3 value=0 offset=226254
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #53 variable-ref ref=ydisp4 value=0 offset=226256
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #54 variable-ref ref=ydisp6 value=0 offset=226258
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #55 variable-ref ref=ydisp7 value=0 offset=226260
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #56 variable-ref ref=ydisp8 value=0 offset=226262
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #57 variable-ref ref=ydisp10 value=0 offset=226264
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #58 variable-ref ref=ydisp11 value=0 offset=226266
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #59 variable-ref ref=ydisp12 value=1 offset=226268
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #60 variable-ref ref=ydisp14 value=0 offset=226270
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #61 variable-ref ref=ydisp15 value=0 offset=226272
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #62 variable-ref ref=ydisp16 value=0 offset=226274
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #63 variable-ref ref=eq2 value=0 offset=226276
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #64 variable-ref ref=eq4 value=0 offset=226278
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #65 variable-ref ref=eq6 value=0 offset=226280
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #66 variable-ref ref=eq8 value=0 offset=226282
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #67 variable-ref ref=eq10 value=0 offset=226284
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #68 variable-ref ref=eq12 value=1 offset=226286
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #69 variable-ref ref=eq14 value=0 offset=226292
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #70 variable-ref ref=eq16 value=0 offset=226294
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #71 variable-ref ref=ydisp2 value=0 offset=226296
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #72 variable-ref ref=ydisp3 value=0 offset=226298
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #73 variable-ref ref=ydisp4 value=0 offset=226300
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #74 variable-ref ref=ydisp6 value=0 offset=226302
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #75 variable-ref ref=ydisp7 value=0 offset=226304
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #76 variable-ref ref=ydisp8 value=0 offset=226306
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #77 variable-ref ref=ydisp10 value=0 offset=226308
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #78 variable-ref ref=ydisp11 value=0 offset=226310
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #79 variable-ref ref=ydisp12 value=1 offset=226312
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #80 variable-ref ref=ydisp14 value=0 offset=226314
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #81 variable-ref ref=ydisp15 value=0 offset=226316
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #82 variable-ref ref=ydisp16 value=0 offset=226318
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #83 variable-ref ref=xdisp2 value=0 offset=226320
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #84 variable-ref ref=xdisp3 value=0 offset=226322
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #85 variable-ref ref=xdisp4 value=0 offset=226324
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #86 variable-ref ref=xdisp6 value=0 offset=226340
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #87 variable-ref ref=xdisp7 value=0 offset=226342
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #88 variable-ref ref=xdisp8 value=0 offset=226344
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #89 variable-ref ref=xdisp10 value=0 offset=226346
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #90 variable-ref ref=xdisp11 value=0 offset=226348
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #91 variable-ref ref=xdisp12 value=1 offset=226350
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #92 variable-ref ref=xdisp14 value=0 offset=226352
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #93 variable-ref ref=xdisp15 value=0 offset=226354
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #94 variable-ref ref=xdisp16 value=0 offset=226356
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #95 variable-ref ref=eq2 value=0 offset=226358
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #96 variable-ref ref=eq4 value=0 offset=226360
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #97 variable-ref ref=eq6 value=0 offset=226362
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #98 variable-ref ref=eq8 value=0 offset=226364
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #99 variable-ref ref=eq10 value=0 offset=226366
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #100 variable-ref ref=eq12 value=1 offset=226368
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #101 variable-ref ref=eq14 value=0 offset=226370
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #102 variable-ref ref=eq16 value=0 offset=226372
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #103 unknown-object ref=- value=- offset=226378
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #104 unknown-object ref=- value=- offset=226380
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #105 unknown-object ref=- value=- offset=226382
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #106 unknown-object ref=- value=- offset=226384
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #107 unknown-object ref=- value=- offset=226386
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #108 unknown-object ref=- value=- offset=226388
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #109 unknown-object ref=- value=- offset=226390
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #110 unknown-object ref=- value=- offset=226392
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #111 unknown-object ref=- value=- offset=226394
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #112 unknown-object ref=- value=- offset=226396
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #113 unknown-object ref=- value=- offset=226398
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #114 unknown-object ref=- value=- offset=226400
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #115 unknown-object ref=- value=- offset=226402
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #116 unknown-object ref=- value=- offset=226404
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #117 unknown-object ref=- value=- offset=226406
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #118 unknown-object ref=- value=- offset=226408
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #119 unknown-object ref=- value=- offset=226410
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #120 unknown-object ref=- value=- offset=226424
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #121 unknown-object ref=- value=- offset=226426
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #122 unknown-object ref=- value=- offset=226428
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #123 unknown-object ref=- value=- offset=226430
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #124 unknown-object ref=- value=- offset=226432
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #125 unknown-object ref=- value=- offset=226434
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #126 unknown-object ref=- value=- offset=226436
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #127 unknown-object ref=- value=- offset=226438
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #128 unknown-object ref=- value=- offset=226440
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #129 unknown-object ref=- value=- offset=226442
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #130 unknown-object ref=- value=- offset=226444
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #131 unknown-object ref=- value=- offset=226446
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #132 unknown-object ref=- value=- offset=226448
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #133 unknown-object ref=- value=- offset=226450
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #134 unknown-object ref=- value=- offset=226452
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #135 unknown-object ref=- value=- offset=226454
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #136 unknown-object ref=- value=- offset=226456
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #137 unknown-object ref=- value=- offset=226462
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #138 unknown-object ref=- value=- offset=226464
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #139 unknown-object ref=- value=- offset=226466
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #140 unknown-object ref=- value=- offset=226468
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #141 unknown-object ref=- value=- offset=226470
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #142 unknown-object ref=- value=- offset=226472
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #143 unknown-object ref=- value=- offset=226474
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #144 unknown-object ref=- value=- offset=226476
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #145 unknown-object ref=- value=- offset=226478
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #146 unknown-object ref=- value=- offset=226480
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #147 unknown-object ref=- value=- offset=226482
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #148 unknown-object ref=- value=- offset=226484
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #149 unknown-object ref=- value=- offset=226486
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #150 unknown-object ref=- value=- offset=226488
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #151 unknown-object ref=- value=- offset=226490
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #152 unknown-object ref=- value=- offset=226492
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #153 unknown-object ref=- value=- offset=226494
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])

## record-13 @ 283102

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | Unit Circle | exact value | tangent ratio
- Counts: strings=1458, variables=68, display=9, refs=424, slots=153, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]? A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
```

Choices:
- A. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- B. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- C. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- D. ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) 2 3

Variables:
- eq1 = 0  rule: `if(which=1,true,false)`
- eq2 = 0  rule: `if(which=2,true,false)`
- eq3 = 0  rule: `if(which=3,true,false)`
- eq4 = 0  rule: `if(which=4,true,false)`
- eq5 = 0  rule: `if(which=5,true,false)`
- eq6 = 0  rule: `if(which=6,true,false)`
- eq7 = 0  rule: `if(which=7,true,false)`
- eq8 = 0  rule: `if(which=8,true,false)`
- eq9 = 0  rule: `if(which=9,true,false)`
- eq10 = 0  rule: `if(which=10,true,false)`
- eq11 = 0  rule: `if(which=11,true,false)`
- eq12 = 1  rule: `if(which=12,true,false)`
- eq13 = 0  rule: `if(which=13,true,false)`
- eq14 = 0  rule: `if(which=14,true,false)`
- eq15 = 0  rule: `if(which=15,true,false)`
- eq16 = 0  rule: `if(which=16,true,false)`
- eq17 = 0  rule: `if(which=17,true,false)`
- xdisp1 = 0  rule: `if(which=1,true,false)`
- xdisp2 = 0  rule: `if(which=2,true,false)`
- xdisp3 = 0  rule: `if(which=3,true,false)`
- xdisp4 = 0  rule: `if(which=4,true,false)`
- xdisp5 = 0  rule: `if(which=5,true,false)`
- xdisp6 = 0  rule: `if(which=6,true,false)`
- xdisp7 = 0  rule: `if(which=7,true,false)`

Inline slots:
- #1 variable-ref ref=eq2 value=0 offset=290552
  context: Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #2 variable-ref ref=eq4 value=0 offset=290554
  context: Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #3 variable-ref ref=eq6 value=0 offset=290556
  context: Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #4 variable-ref ref=eq8 value=0 offset=290558
  context: Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #5 variable-ref ref=eq10 value=0 offset=290560
  context: Which point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #6 variable-ref ref=eq12 value=1 offset=290562
  context: h point on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #7 variable-ref ref=eq14 value=0 offset=290564
  context: on the unit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #8 variable-ref ref=eq16 value=0 offset=290566
  context: nit circle corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #9 variable-ref ref=xdisp2 value=0 offset=290568
  context: le corresponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #10 variable-ref ref=xdisp3 value=0 offset=290570
  context: sponds to tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #11 variable-ref ref=xdisp4 value=0 offset=290572
  context: o tan q = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #12 variable-ref ref=xdisp6 value=0 offset=290574
  context: = [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #13 variable-ref ref=xdisp7 value=0 offset=290576
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #14 variable-ref ref=xdisp8 value=0 offset=290578
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #15 variable-ref ref=xdisp10 value=0 offset=290580
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #16 variable-ref ref=xdisp11 value=0 offset=290582
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #17 variable-ref ref=xdisp12 value=1 offset=290584
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]?
- #18 variable-ref ref=xdisp14 value=0 offset=290598
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #19 variable-ref ref=xdisp15 value=0 offset=290600
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #20 variable-ref ref=xdisp16 value=0 offset=290602
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #21 variable-ref ref=eq2 value=0 offset=290604
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #22 variable-ref ref=eq4 value=0 offset=290606
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #23 variable-ref ref=eq6 value=0 offset=290608
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[
- #24 variable-ref ref=eq8 value=0 offset=290610
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][
- #25 variable-ref ref=eq10 value=0 offset=290612
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][
- #26 variable-ref ref=eq12 value=1 offset=290614
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][
- #27 variable-ref ref=eq14 value=0 offset=290616
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][
- #28 variable-ref ref=eq16 value=0 offset=290618
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][
- #29 variable-ref ref=eq2 value=0 offset=290620
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #30 variable-ref ref=eq4 value=0 offset=290622
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #31 variable-ref ref=eq6 value=0 offset=290624
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #32 variable-ref ref=eq8 value=0 offset=290626
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #33 variable-ref ref=eq10 value=0 offset=290628
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #34 variable-ref ref=eq12 value=1 offset=290630
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #35 variable-ref ref=eq14 value=0 offset=290634
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #36 variable-ref ref=eq16 value=0 offset=290636
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #37 variable-ref ref=ydisp2 value=0 offset=290638
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #38 variable-ref ref=ydisp3 value=0 offset=290640
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #39 variable-ref ref=ydisp4 value=0 offset=290642
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #40 variable-ref ref=ydisp6 value=0 offset=290644
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #41 variable-ref ref=ydisp7 value=0 offset=290646
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #42 variable-ref ref=ydisp8 value=0 offset=290648
  context: ][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #43 variable-ref ref=ydisp10 value=0 offset=290650
  context: ][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #44 variable-ref ref=ydisp11 value=0 offset=290652
  context: ][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #45 variable-ref ref=ydisp12 value=1 offset=290654
  context: ][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #46 variable-ref ref=ydisp14 value=0 offset=290656
  context: ],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #47 variable-ref ref=ydisp15 value=0 offset=290658
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #48 variable-ref ref=ydisp16 value=0 offset=290660
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #49 variable-ref ref=ydisp2 value=0 offset=290662
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #50 variable-ref ref=ydisp3 value=0 offset=290664
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #51 variable-ref ref=ydisp4 value=0 offset=290666
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #52 variable-ref ref=ydisp6 value=0 offset=290680
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #53 variable-ref ref=ydisp7 value=0 offset=290682
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #54 variable-ref ref=ydisp8 value=0 offset=290684
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #55 variable-ref ref=ydisp10 value=0 offset=290686
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #56 variable-ref ref=ydisp11 value=0 offset=290688
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #57 variable-ref ref=ydisp12 value=1 offset=290690
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[
- #58 variable-ref ref=ydisp14 value=0 offset=290692
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][
- #59 variable-ref ref=ydisp15 value=0 offset=290694
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][
- #60 variable-ref ref=ydisp16 value=0 offset=290696
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][
- #61 variable-ref ref=xdisp2 value=0 offset=290698
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][
- #62 variable-ref ref=xdisp3 value=0 offset=290700
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][
- #63 variable-ref ref=xdisp4 value=0 offset=290702
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #64 variable-ref ref=xdisp6 value=0 offset=290704
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #65 variable-ref ref=xdisp7 value=0 offset=290706
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #66 variable-ref ref=xdisp8 value=0 offset=290708
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #67 variable-ref ref=xdisp10 value=0 offset=290710
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #68 variable-ref ref=xdisp11 value=0 offset=290712
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #69 variable-ref ref=xdisp12 value=1 offset=290716
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #70 variable-ref ref=xdisp14 value=0 offset=290718
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #71 variable-ref ref=xdisp15 value=0 offset=290720
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #72 variable-ref ref=xdisp16 value=0 offset=290722
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #73 variable-ref ref=xdisp2 value=0 offset=290724
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #74 variable-ref ref=xdisp3 value=0 offset=290726
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #75 variable-ref ref=xdisp4 value=0 offset=290728
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #76 variable-ref ref=xdisp6 value=0 offset=290730
  context: ][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #77 variable-ref ref=xdisp7 value=0 offset=290732
  context: ][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #78 variable-ref ref=xdisp8 value=0 offset=290734
  context: ][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #79 variable-ref ref=xdisp10 value=0 offset=290736
  context: ][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #80 variable-ref ref=xdisp11 value=0 offset=290738
  context: ],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #81 variable-ref ref=xdisp12 value=1 offset=290740
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #82 variable-ref ref=xdisp14 value=0 offset=290742
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #83 variable-ref ref=xdisp15 value=0 offset=290744
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #84 variable-ref ref=xdisp16 value=0 offset=290746
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #85 variable-ref ref=ydisp2 value=0 offset=290748
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #86 variable-ref ref=ydisp3 value=0 offset=290764
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #87 variable-ref ref=ydisp4 value=0 offset=290766
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #88 variable-ref ref=ydisp6 value=0 offset=290768
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #89 variable-ref ref=ydisp7 value=0 offset=290770
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #90 variable-ref ref=ydisp8 value=0 offset=290772
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #91 variable-ref ref=ydisp10 value=0 offset=290774
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[
- #92 variable-ref ref=ydisp11 value=0 offset=290776
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][
- #93 variable-ref ref=ydisp12 value=1 offset=290778
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][
- #94 variable-ref ref=ydisp14 value=0 offset=290780
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][
- #95 variable-ref ref=ydisp15 value=0 offset=290782
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][
- #96 variable-ref ref=ydisp16 value=0 offset=290784
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][
- #97 unknown-object ref=- value=- offset=290786
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #98 unknown-object ref=- value=- offset=290788
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #99 unknown-object ref=- value=- offset=290790
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #100 unknown-object ref=- value=- offset=290792
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #101 unknown-object ref=- value=- offset=290794
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #102 unknown-object ref=- value=- offset=290796
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #103 unknown-object ref=- value=- offset=290800
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #104 unknown-object ref=- value=- offset=290802
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #105 unknown-object ref=- value=- offset=290804
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #106 unknown-object ref=- value=- offset=290806
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #107 unknown-object ref=- value=- offset=290808
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #108 unknown-object ref=- value=- offset=290810
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #109 unknown-object ref=- value=- offset=290812
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #110 unknown-object ref=- value=- offset=290814
  context: ][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #111 unknown-object ref=- value=- offset=290816
  context: ][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #112 unknown-object ref=- value=- offset=290818
  context: ][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #113 unknown-object ref=- value=- offset=290820
  context: ][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #114 unknown-object ref=- value=- offset=290822
  context: ],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #115 unknown-object ref=- value=- offset=290824
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #116 unknown-object ref=- value=- offset=290826
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #117 unknown-object ref=- value=- offset=290828
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #118 unknown-object ref=- value=- offset=290830
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #119 unknown-object ref=- value=- offset=290832
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #120 unknown-object ref=- value=- offset=290846
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #121 unknown-object ref=- value=- offset=290848
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #122 unknown-object ref=- value=- offset=290850
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #123 unknown-object ref=- value=- offset=290852
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #124 unknown-object ref=- value=- offset=290854
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #125 unknown-object ref=- value=- offset=290856
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[
- #126 unknown-object ref=- value=- offset=290858
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][
- #127 unknown-object ref=- value=- offset=290860
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][
- #128 unknown-object ref=- value=- offset=290862
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][
- #129 unknown-object ref=- value=- offset=290864
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][
- #130 unknown-object ref=- value=- offset=290866
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][
- #131 unknown-object ref=- value=- offset=290868
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #132 unknown-object ref=- value=- offset=290870
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #133 unknown-object ref=- value=- offset=290872
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #134 unknown-object ref=- value=- offset=290874
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #135 unknown-object ref=- value=- offset=290876
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #136 unknown-object ref=- value=- offset=290878
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][
- #137 unknown-object ref=- value=- offset=290882
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #138 unknown-object ref=- value=- offset=290884
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #139 unknown-object ref=- value=- offset=290886
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #140 unknown-object ref=- value=- offset=290888
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #141 unknown-object ref=- value=- offset=290890
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #142 unknown-object ref=- value=- offset=290892
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #143 unknown-object ref=- value=- offset=290894
  context: ][[slot]][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #144 unknown-object ref=- value=- offset=290896
  context: ][[slot]][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #145 unknown-object ref=- value=- offset=290898
  context: ][[slot]][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #146 unknown-object ref=- value=- offset=290900
  context: ][[slot]][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #147 unknown-object ref=- value=- offset=290902
  context: ][[slot]],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #148 unknown-object ref=- value=- offset=290904
  context: ],[[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #149 unknown-object ref=- value=- offset=290906
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #150 unknown-object ref=- value=- offset=290908
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #151 unknown-object ref=- value=- offset=290910
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #152 unknown-object ref=- value=- offset=290912
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #153 unknown-object ref=- value=- offset=290914
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])

## record-14 @ 340826

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | unit circle | exact value | tangent ratio
- Counts: strings=1618, variables=51, display=9, refs=580, slots=103, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Identify a measure for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm. A. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] C. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] B. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] D. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- B. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- C. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- D. [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]

Variables:
- rad1 = 0  rule: `if(which=1,true,false)`
- rad2 = 0  rule: `if(which=2,true,false)`
- rad3 = 0  rule: `if(which=3,true,false)`
- rad4 = 0  rule: `if(which=4,true,false)`
- rad5 = 0  rule: `if(which=5,true,false)`
- rad6 = 0  rule: `if(which=6,true,false)`
- rad7 = 1  rule: `if(which=7,true,false)`
- rad8 = 0  rule: `if(which=8,true,false)`
- rad9 = 0  rule: `if(which=9,true,false)`
- rad10 = 0  rule: `if(which=10,true,false)`
- rad11 = 0  rule: `if(which=11,true,false)`
- rad12 = 0  rule: `if(which=12,true,false)`
- rad13 = 0  rule: `if(which=13,true,false)`
- rad14 = 0  rule: `if(which=14,true,false)`
- rad15 = 0  rule: `if(which=15,true,false)`
- rad16 = 0  rule: `if(which=16,true,false)`
- rad17 = 0  rule: `if(which=17,true,false)`
- xdisp1 = 0  rule: `if(which=1,true,false)`
- xdisp2 = 0  rule: `if(which=2,true,false)`
- xdisp3 = 0  rule: `if(which=3,true,false)`
- xdisp4 = 0  rule: `if(which=4,true,false)`
- xdisp5 = 0  rule: `if(which=5,true,false)`
- xdisp6 = 0  rule: `if(which=6,true,false)`
- xdisp7 = 1  rule: `if(which=7,true,false)`

Inline slots:
- #1 variable-ref ref=xdisp2 value=0 offset=346658
  context: Identify a measure for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #2 variable-ref ref=xdisp3 value=0 offset=346696
  context: Identify a measure for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #3 variable-ref ref=xdisp4 value=0 offset=346698
  context: ntify a measure for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #4 variable-ref ref=xdisp6 value=0 offset=346700
  context: measure for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #5 variable-ref ref=xdisp7 value=1 offset=346702
  context: for the central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #6 variable-ref ref=xdisp8 value=0 offset=346704
  context: central angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #7 variable-ref ref=xdisp10 value=0 offset=346706
  context: angle q in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]],
- #8 variable-ref ref=xdisp11 value=0 offset=346708
  context: in the interval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]]
- #9 variable-ref ref=xdisp12 value=0 offset=346710
  context: nterval [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]]
- #10 variable-ref ref=xdisp14 value=0 offset=346712
  context: [[slot]] such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]]
- #11 variable-ref ref=xdisp15 value=0 offset=346714
  context: such that point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]]
- #12 variable-ref ref=xdisp16 value=0 offset=346716
  context: at point ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]]
- #13 variable-ref ref=ydisp2 value=0 offset=346718
  context: ([[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #14 variable-ref ref=ydisp3 value=0 offset=346720
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #15 variable-ref ref=ydisp4 value=0 offset=346722
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #16 variable-ref ref=ydisp6 value=0 offset=346724
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #17 variable-ref ref=ydisp7 value=1 offset=346726
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #18 variable-ref ref=ydisp8 value=0 offset=346728
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #19 variable-ref ref=ydisp10 value=0 offset=346734
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #20 variable-ref ref=ydisp11 value=0 offset=346736
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #21 variable-ref ref=ydisp12 value=0 offset=346738
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #22 variable-ref ref=ydisp14 value=0 offset=346740
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #23 variable-ref ref=ydisp15 value=0 offset=346742
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #24 variable-ref ref=ydisp16 value=0 offset=346744
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]])
- #25 variable-ref ref=rad9 value=0 offset=346746
  context: [[slot]][[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on th
- #26 variable-ref ref=rad10 value=0 offset=346748
  context: [[slot]][[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the termin
- #27 variable-ref ref=rad11 value=0 offset=346750
  context: [[slot]][[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #28 variable-ref ref=rad12 value=0 offset=346752
  context: [[slot]][[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #29 variable-ref ref=rad13 value=0 offset=346754
  context: [[slot]], [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #30 variable-ref ref=rad14 value=0 offset=346756
  context: , [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #31 variable-ref ref=rad15 value=0 offset=346758
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #32 variable-ref ref=rad17 value=0 offset=346760
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #33 variable-ref ref=rad1 value=0 offset=346762
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #34 variable-ref ref=rad2 value=0 offset=346764
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #35 variable-ref ref=rad3 value=0 offset=346766
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]) is on the terminal arm.
- #36 variable-ref ref=rad4 value=0 offset=346826
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #37 variable-ref ref=rad5 value=0 offset=346828
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #38 variable-ref ref=rad6 value=0 offset=346830
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #39 variable-ref ref=rad2 value=0 offset=346832
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #40 variable-ref ref=rad3 value=0 offset=346834
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #41 variable-ref ref=rad4 value=0 offset=346836
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #42 variable-ref ref=rad5 value=0 offset=346838
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #43 variable-ref ref=rad6 value=0 offset=346840
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #44 variable-ref ref=rad7 value=1 offset=346842
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #45 variable-ref ref=rad8 value=0 offset=346844
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #46 variable-ref ref=rad10 value=0 offset=346846
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #47 variable-ref ref=rad11 value=0 offset=346848
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #48 variable-ref ref=rad12 value=0 offset=346850
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #49 variable-ref ref=rad13 value=0 offset=346852
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #50 variable-ref ref=rad14 value=0 offset=346854
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #51 variable-ref ref=rad15 value=0 offset=346856
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #52 variable-ref ref=rad16 value=0 offset=346858
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #53 variable-ref ref=rad5 value=0 offset=346868
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #54 variable-ref ref=rad6 value=0 offset=346870
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #55 variable-ref ref=rad7 value=1 offset=346872
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #56 variable-ref ref=rad8 value=0 offset=346874
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #57 variable-ref ref=rad9 value=0 offset=346876
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #58 variable-ref ref=rad10 value=0 offset=346878
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #59 variable-ref ref=rad11 value=0 offset=346880
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #60 variable-ref ref=rad13 value=0 offset=346882
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #61 variable-ref ref=rad14 value=0 offset=346884
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #62 variable-ref ref=rad15 value=0 offset=346886
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #63 variable-ref ref=rad16 value=0 offset=346888
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #64 variable-ref ref=rad17 value=0 offset=346890
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #65 variable-ref ref=rad1 value=0 offset=346892
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #66 variable-ref ref=rad2 value=0 offset=346894
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #67 variable-ref ref=rad13 value=0 offset=346896
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #68 variable-ref ref=rad14 value=0 offset=346898
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #69 variable-ref ref=rad15 value=0 offset=346900
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #70 variable-ref ref=rad16 value=0 offset=346912
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #71 variable-ref ref=rad17 value=0 offset=346914
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #72 variable-ref ref=rad1 value=0 offset=346916
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #73 variable-ref ref=rad2 value=0 offset=346918
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #74 variable-ref ref=rad4 value=0 offset=346920
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #75 variable-ref ref=rad5 value=0 offset=346922
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #76 variable-ref ref=rad6 value=0 offset=346924
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #77 variable-ref ref=rad7 value=1 offset=346926
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #78 variable-ref ref=rad8 value=0 offset=346928
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #79 variable-ref ref=rad9 value=0 offset=346930
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #80 variable-ref ref=rad10 value=0 offset=346932
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #81 unknown-object ref=- value=- offset=346934
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #82 unknown-object ref=- value=- offset=346936
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #83 unknown-object ref=- value=- offset=346938
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #84 unknown-object ref=- value=- offset=346940
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #85 unknown-object ref=- value=- offset=346942
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #86 unknown-object ref=- value=- offset=346944
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #87 unknown-object ref=- value=- offset=346954
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #88 unknown-object ref=- value=- offset=346956
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #89 unknown-object ref=- value=- offset=346958
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #90 unknown-object ref=- value=- offset=346960
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #91 unknown-object ref=- value=- offset=346962
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[
- #92 unknown-object ref=- value=- offset=346964
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #93 unknown-object ref=- value=- offset=346966
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #94 unknown-object ref=- value=- offset=346968
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #95 unknown-object ref=- value=- offset=346970
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #96 unknown-object ref=- value=- offset=346972
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #97 unknown-object ref=- value=- offset=346974
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #98 unknown-object ref=- value=- offset=346976
  context: [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #99 unknown-object ref=- value=- offset=346978
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #100 unknown-object ref=- value=- offset=346980
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #101 unknown-object ref=- value=- offset=346982
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #102 unknown-object ref=- value=- offset=346984
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]
- #103 unknown-object ref=- value=- offset=346986
  context: ]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]][[slot]]

## record-15 @ 393831

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | reciprocal trigonometric ratios | approximate values
- Counts: strings=110, variables=7, display=9, refs=15, slots=6, visibleChoices=4

```text
Which is a possible value of q, to the nearest hundredth of a radian, when [[slot]] q = [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- function_list = sin, cos, tan, csc, sec, cot  rule: `list("sin","cos","tan","csc","sec","cot")`
- select_function = cos  rule: `choose(which,function_list)`
- soln = –0.58  rule: `range(-1,1,0.01)`
- ans = 2.19  rule: `if(select_function="sin",asin(soln),if(select_function="cos",acos(soln),if(select_function="tan",atan(soln),if(select_function="csc",acsc(soln),if(select_function="sec",asec(soln),acot(soln))))))`
- dis_1 = –0.62  rule: `if(select_function="sin",acos(soln),if(select_function="cos",asin(soln),if(select_function="tan",atan(soln),if(select_function="csc",asec(soln),if(select_function="sec",acsc(soln),acot(soln))))))`
- dis_2 = 0.84  rule: `if(select_function="sin",sin(soln+0.2),if(select_function="cos",cos(soln),if(select_function="tan",tan(soln),if(select_function="csc",csc(soln),if(select_function="sec",sec(soln),cot(soln))))))`
- dis_3 = –2.19  rule: `if(select_function="sin",-asin(soln),if(select_function="cos",-acos(soln),if(select_function="tan",-atan(soln),if(select_function="csc",-acsc(soln),if(select_function="sec",-asec(soln),-acot(soln))))))`

Inline slots:
- #1 variable-ref ref=select_function value=cos offset=396857
  context: Which is a possible value of q, to the nearest hundredth of a radian, when [[slot]] q = [[slot]]?
- #2 variable-ref ref=soln value=–0.58 offset=396869
  context: Which is a possible value of q, to the nearest hundredth of a radian, when [[slot]] q = [[slot]]?
- #3 variable-ref ref=dis_3 value=–2.19 offset=396881
  context: [[slot]]
- #4 variable-ref ref=ans value=2.19 offset=396891
  context: [[slot]]
- #5 variable-ref ref=dis_1 value=–0.62 offset=396903
  context: [[slot]]
- #6 variable-ref ref=dis_2 value=0.84 offset=396913
  context: [[slot]]

## record-16 @ 399593

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | rotations | standard position
- Counts: strings=85, variables=5, display=10, refs=11, slots=5, visibleChoices=4

```text
If the angle q is [[slot]] in standard position, it can be described as having made A. [[slot]] rotations C. [[slot]] rotations B. [[slot]] rotations D. [[slot]] rotations
```

Choices:
- A. [[slot]] rotations
- B. [[slot]] rotations
- C. [[slot]] rotations
- D. [[slot]] rotations

Variables:
- degrees = –5000  rule: `range(-5000,5000,100)`
- answer = -13/8/9  rule: `mixfracs(degrees,360)`
- dis_1 = -27/7/9  rule: `mixfracs(degrees,180)`
- dis_2 = 13/8/9  rule: `mixfracs(-degrees,360)`
- dis_3 = 27/7/9  rule: `mixfracs(-degrees,180)`

Inline slots:
- #1 variable-ref ref=degrees value=–5000 offset=400527
  context: If the angle q is [[slot]]
- #2 variable-ref ref=dis_2 value=13/8/9 offset=400653
  context: [[slot]] rotations
- #3 variable-ref ref=dis_3 value=27/7/9 offset=400683
  context: [[slot]] rotations
- #4 variable-ref ref=answer value=-13/8/9 offset=400715
  context: [[slot]] rotations
- #5 variable-ref ref=dis_1 value=-27/7/9 offset=400745
  context: [[slot]] rotations

## record-17 @ 403233

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | rotations | degrees | co-terminal angles
- Counts: strings=87, variables=0, display=18, refs=17, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Mixed numbers –400 -1/1/9 degrees+180 –220 -degrees 400 -degrees+180 580 During a routine, a figure skater completes [[slot]] rotations. How many degrees has the figure skater turned? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 unknown-object ref=- value=- offset=404145
  context: During a routine, a figure skater completes [[slot]] rotations. How many degrees has the figure skater turned?
- #2 unknown-object ref=- value=- offset=404271
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=404283
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=404297
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=404309
  context: [[slot]]

## record-18 @ 406665

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | rotations | standard position
- Counts: strings=103, variables=7, display=10, refs=9, slots=5, visibleChoices=4

```text
If the angle q is [[slot]] in standard position, in which quadrant does it terminate? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- degrees = 1600  rule: `range(1000,5000,100)`
- answer = 40/9  rule: `fracs(degrees,360)`
- remain = 160  rule: `degrees mod 360`
- quad = quadrant II  rule: `if(remain<90,"quadrant I",if(remain<180,"quadrant II",if(remain<270,"quadrant III","quadrant IV")))`
- dis_1 = quadrant III  rule: `if(remain<90,"quadrant II",if(remain<180,"quadrant III",if(remain<270,"quadrant IV","quadrant I")))`
- dis_2 = quadrant IV  rule: `if(remain<90,"quadrant III",if(remain<180,"quadrant IV",if(remain<270,"quadrant I","quadrant II")))`
- dis_3 = quadrant I  rule: `if(remain<90,"quadrant IV",if(remain<180,"quadrant I",if(remain<270,"quadrant II","quadrant III")))`

Inline slots:
- #1 variable-ref ref=degrees value=1600 offset=408485
  context: If the angle q is [[slot]]
- #2 variable-ref ref=dis_1 value=quadrant III offset=408615
  context: [[slot]]
- #3 variable-ref ref=quad value=quadrant II offset=408625
  context: [[slot]]
- #4 variable-ref ref=dis_2 value=quadrant IV offset=408637
  context: [[slot]]
- #5 variable-ref ref=dis_3 value=quadrant I offset=408647
  context: [[slot]]

## record-19 @ 411115

- Metadata: Easy | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios
- Counts: strings=299, variables=6, display=10, refs=82, slots=6, visibleChoices=4

```text
A ball is riding the waves at a beach. The ball s up and down motion with the waves can be described using the formula [[slot]], where h is the height, in metres, above the flat surface of the water and t is the time, in seconds. What is the height of the ball, to the nearest hundredth of a metre, after t = [[slot]] s? A. [[slot]] m C. [[slot]] m B. [[slot]] m D. [[slot]] m
```

Choices:
- A. [[slot]] m
- B. [[slot]] m
- C. [[slot]] m
- D. [[slot]] m

Variables:
- seconds = 17  rule: `range(2,20,1)`
- ans = –1.99  rule: `a*sin((pi*seconds)/3)`
- dis_1 = –0.87  rule: `sin((pi*seconds)/3)`
- dis_2 = –2.66  rule: `a*csc((pi*seconds)/3)`
- dis_3 = 1.99  rule: `-a*sin((pi*seconds)/3)`
- a = 2.3  rule: `range(1,4,0.1)`

Inline slots:
- #1 variable-ref ref=a value=2.3 offset=412355
  context: s up and down motion with the waves can be described using the formula [[slot]], where h is the height, in metres, above the flat surface of the water and t is the time,
- #2 variable-ref ref=seconds value=17 offset=412721
  context: n seconds. What is the height of the ball, to the nearest hundredth of a metre, after t = [[slot]] s?
- #3 variable-ref ref=dis_1 value=–0.87 offset=412737
  context: [[slot]] m
- #4 variable-ref ref=ans value=–1.99 offset=412751
  context: [[slot]] m
- #5 variable-ref ref=dis_2 value=–2.66 offset=412767
  context: [[slot]] m
- #6 variable-ref ref=dis_3 value=1.99 offset=412781
  context: [[slot]] m

## record-20 @ 425993

- Metadata: Difficult | Section 4.3 | T3 | Trigonometric Ratios | unit circle | trigonometric ratios
- Counts: strings=109, variables=6, display=9, refs=24, slots=6, visibleChoices=4

```text
The point P([[slot]], [[slot]]) is the point of intersection of a unit circle and the terminal arm of an angle q in standard position. What is the equation of the line passing through the centre of the circle and the point P? Round the slope to two decimal places. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- degree = 67  rule: `rand(89)`
- radian = 1.169370598836  rule: `degree*pi/180`
- x_coord = 0.391  rule: `cos(radian)`
- y_coord = 0.921  rule: `sin(radian)`
- slope = 2.36  rule: `y_coord/x_coord`
- slope_dis1 = 0.42  rule: `x_coord/y_coord`

Inline slots:
- #1 variable-ref ref=x_coord value=0.391 offset=427059
  context: The point P([[slot]], [[slot]]) is the point of intersection of a unit circle and the terminal arm of an angle
- #2 variable-ref ref=y_coord value=0.921 offset=427065
  context: The point P([[slot]], [[slot]]) is the point of intersection of a unit circle and the terminal arm of an angle q in stan
- #3 variable-ref ref=slope value=2.36 offset=427543
  context: [[slot]]
- #4 variable-ref ref=slope value=2.36 offset=427553
  context: [[slot]]
- #5 variable-ref ref=slope_dis1 value=0.42 offset=427565
  context: [[slot]]
- #6 variable-ref ref=slope value=2.36 offset=427575
  context: [[slot]]

## record-21 @ 431055

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios
- Counts: strings=69, variables=6, display=10, refs=7, slots=5, visibleChoices=4

```text
degree<>0 and degree<>90 and degree<>180 and degree<>270 and degree<>360 Giai got an answer of [[slot]] when she was calculating the value of a trigonometric function. Assuming Giai did her calculation correctly, which of the following was she calculating? A. tan [[slot]]p C. csc [[slot]]p B. sec [[slot]]p D. cot [[slot]]p
```

Choices:
- A. tan [[slot]]p
- B. sec [[slot]]p
- C. csc [[slot]]p
- D. cot [[slot]]p

Variables:
- degree = 15  rule: `range(0,360,15)`
- degree_dis = 105  rule: `degree+90`
- rads = 0.26  rule: `degree*pi/180`
- ans = 3.86  rule: `csc(rads)`
- rad_dis = 1/12  rule: `fracs(degree,180)`
- rad_dis1 = 7/12  rule: `fracs(degree_dis,180)`

Inline slots:
- #1 variable-ref ref=ans value=3.86 offset=432125
  context: Giai got an answer of [[slot]] when she was calculating the value of a trigonometric function. Assuming Giai did her cal
- #2 variable-ref ref=rad_dis value=1/12 offset=432449
  context: tan [[slot]]p
- #3 variable-ref ref=rad_dis value=1/12 offset=432469
  context: csc [[slot]]p
- #4 variable-ref ref=rad_dis1 value=7/12 offset=432491
  context: sec [[slot]]p
- #5 variable-ref ref=rad_dis value=1/12 offset=432511
  context: cot [[slot]]p

## record-22 @ 435119

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | reciprocal trigonometric ratios
- Counts: strings=90, variables=6, display=10, refs=13, slots=6, visibleChoices=4

```text
A bottle is riding the waves at a beach. The bottle s up and down motion with the waves can be described using the formula [[slot]], where h is the height, in metres, above the flat water surface and t is the time, in seconds. When is the first time, to the nearest tenth of a second, that the height of the bottle will be [[slot]] m? A. [[slot]] s C. [[slot]] s B. [[slot]] s D. [[slot]] s
```

Choices:
- A. [[slot]] s
- B. [[slot]] s
- C. [[slot]] s
- D. [[slot]] s

Variables:
- height = 1.4  rule: `range(-4,4,0.1)`
- a = 1.4  rule: `range(-4,4,0.1)`
- ans = 1.5  rule: `(3/pi)*asin((height/a))`
- dis_1 = 14.8  rule: `(pi*3)*asin((height/a))`
- dis_2 = 1.1  rule: `(3/pi)*csc((a/height))`
- dis_3 = 0.9  rule: `(pi/3)*sin((a/height))`

Inline slots:
- #1 variable-ref ref=a value=1.4 offset=436577
  context: s up and down motion with the waves can be described using the formula [[slot]], where h is the height, in metres, above the flat water surface and t is the time, in sec
- #2 variable-ref ref=height value=1.4 offset=436963
  context: s the first time, to the nearest tenth of a second, that the height of the bottle will be [[slot]] m?
- #3 variable-ref ref=dis_1 value=14.8 offset=436979
  context: [[slot]] s
- #4 variable-ref ref=dis_3 value=0.9 offset=436993
  context: [[slot]] s
- #5 variable-ref ref=dis_2 value=1.1 offset=437009
  context: [[slot]] s
- #6 variable-ref ref=ans value=1.5 offset=437023
  context: [[slot]] s

## record-23 @ 440129

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios
- Counts: strings=35, variables=6, display=1, refs=2, slots=1, visibleChoices=0

```text
The cosine of an angle is _______________ in quadrant [[slot]].
```

Variables:
- statement_list = I, II, III, IV  rule: `list("I","II","III","IV")`
- select_statement = III  rule: `choose(which,statement_list)`
- III = (  rule: `1`
- answer_list = positive, negative, negative, positive  rule: `list("positive","negative","negative","positive")`
- select_answer = negative  rule: `choose(which,answer_list)`
- negative = ?  rule: `8`

Inline slots:
- #1 variable-ref ref=select_statement value=III offset=441177
  context: The cosine of an angle is _______________ in quadrant [[slot]].

## record-24 @ 442675

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios
- Counts: strings=36, variables=5, display=1, refs=2, slots=1, visibleChoices=0

```text
The sine of an angle is _______________ in quadrant [[slot]].
```

Variables:
- statement_list = I, II, III, IV  rule: `list("I","II","III","IV")`
- select_statement = I  rule: `choose(which,statement_list)`
- answer_list = positive, positive, negative, negative  rule: `list("positive","positive","negative","negative")`
- select_answer = positive  rule: `choose(which,answer_list)`
- positive = ?  rule: `6`

Inline slots:
- #1 variable-ref ref=select_statement value=I offset=443715
  context: The sine of an angle is _______________ in quadrant [[slot]].

## record-25 @ 445213

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios | reciprocal trigonometric ratios
- Counts: strings=33, variables=6, display=1, refs=2, slots=1, visibleChoices=0

```text
The reciprocal of [[slot]] is ____________________.
```

Variables:
- statement_list = sine, cosine, tangent  rule: `list("sine","cosine","tangent")`
- select_statement = tangent  rule: `choose(which,statement_list)`
- tangent = ?  rule: `%`
- answer_list = cosecant, secant, cotangent  rule: `list("cosecant","secant","cotangent")`
- select_answer = cotangent  rule: `choose(which,answer_list)`
- cotangent = ?  rule: `-`

Inline slots:
- #1 variable-ref ref=select_statement value=tangent offset=446247
  context: The reciprocal of [[slot]] is ____________________.

## record-26 @ 447795

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios
- Counts: strings=37, variables=0, display=7, refs=2, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("x-coordinate","y-coordinate","ratio of y over x") x-coordinate, y-coordinate, ratio of y over x y-coordinate list("cosine of the reference angle","sine of the reference angle","tangent of the reference angle") cosine of the reference angle, sine of the reference angle, tangent of the reference angle sine of the reference angle For a point on the unit circle, the [[slot]] can be determined using the ____________________.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=449191
  context: For a point on the unit circle, the [[slot]] can be determined using the ____________________.

## record-27 @ 450787

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios
- Counts: strings=39, variables=0, display=12, refs=2, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("largest non-negative value for sin x","smallest non-negative value for sin x","largest non-negative value for cos x", "smallest non-negative value for cos x") largest non-negative value for sin x, smallest non-negative value for sin x, largest non-negative value for cos x, smallest non-negative value for cos x smallest non-negative value for sin x ","180 ","90 ", "270 "), 180, 90, 270 180 The [[slot]] occurs when the angle in standard position is ____________________.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=452275
  context: The [[slot]] occurs when the angle in standard position is ____________________.

## record-28 @ 453907

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | translations | identity
- Counts: strings=25, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=454191
  context: [[slot]]

## record-29 @ 455541

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | translations | identity
- Counts: strings=26, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=455825
  context: [[slot]]

## record-30 @ 457174

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | translations | identity
- Counts: strings=26, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=457458
  context: [[slot]]

## record-31 @ 458807

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | translations | identity
- Counts: strings=26, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=459091
  context: [[slot]]

## record-32 @ 460441

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | trigonometric ratios | translations | identity
- Counts: strings=28, variables=0, display=1, refs=7, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=460725
  context: [[slot]]

## record-33 @ 462074

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | arc length
- Counts: strings=69, variables=0, display=2, refs=23, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A child swings on a playground swing set. If the length of the swing s chain is 3 m and the child swings through an angle of [[slot]], what is the exact arc length through which the child travels?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=462500
  context: s chain is 3 m and the child swings through an angle of [[slot]], what is the exact arc length through which the child travels?

## record-34 @ 465636

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios | special angles
- Counts: strings=105, variables=0, display=1, refs=29, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the exact value of [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=465922
  context: Determine the exact value of [[slot]] .

## record-35 @ 471266

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | special angles | trigonometric ratios
- Counts: strings=621, variables=0, display=1, refs=170, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A 3-m ladder is leaning against a vertical wall such that the angle between the ground and the ladder is [[slot]]. What is the exact height that the ladder reaches up the wall?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=471704
  context: leaning against a vertical wall such that the angle between the ground and the ladder is [[slot]]. What is the exact height that the ladder reaches up the wall?

## record-36 @ 623201

- Metadata: Average | Section 4.4 | T4 | Introduction to Trigonometric Equations | equivalent trigonometric expression | exact value
- Counts: strings=56, variables=0, display=1, refs=16, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Given that [[slot]] and that x lies in the first quadrant, determine the exact measure of angle x.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=623513
  context: Given that [[slot]] and that x lies in the first quadrant, determine the exact measure of angle x.

## record-37 @ 626456

- Metadata: Average | Section 4.3 | T2 | Trigonometric Ratios | reference angle | reciprocal trigonometric ratios | unit circle
- Counts: strings=84, variables=0, display=3, refs=22, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Without using a calculator, determine two angles between 0 and 360 that have a cosecant of [[slot]]. Include an explanation of how you determined the two angles.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=626920
  context: that have a cosecant of [[slot]]. Include an explanation of how you determined the two angles.

## record-38 @ 631367

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | arc length | central angle
- Counts: strings=35, variables=0, display=1, refs=8, slots=0, visibleChoices=0

```text
Given a circle of diameter 21 cm, determine the arc length subtended by a central angle of 1.2 radians.
```

## record-39 @ 633807

- Metadata: Difficult | Section 4.3 | T3 | Trigonometric Ratios | exact value | unit circle
- Counts: strings=67, variables=0, display=1, refs=16, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Find the exact value of [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=634063
  context: Find the exact value of [[slot]] .

## record-40 @ 637533

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | exact value | reciprocal trigonometric ratios
- Counts: strings=113, variables=0, display=1, refs=36, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Angles A and B are located in the first quadrant. If [[slot]] and [[slot]], determine the exact value of sec A + sec B.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=637883
  context: Angles A and B are located in the first quadrant. If [[slot]] and [[slot]], determine the exact value of sec A + sec B.
- #2 unknown-object ref=- value=- offset=637895
  context: Angles A and B are located in the first quadrant. If [[slot]] and [[slot]], determine the exact value of sec A + sec B.

## record-41 @ 643524

- Metadata: Difficult | Section 4.3 | T3 | Trigonometric Ratios | primary trigonometric ratios | exact value
- Counts: strings=102, variables=0, display=1, refs=40, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the exact measures for all angles where [[slot]] in the domain [[slot]].
```

Inline slots:
- #1 fixed-value ref=- value=- offset=643866
  context: Determine the exact measures for all angles where [[slot]] in the domain [[slot]].
- #2 fixed-value ref=- value=- offset=643898
  context: Determine the exact measures for all angles where [[slot]] in the domain [[slot]].

## record-42 @ 648691

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | radian
- Counts: strings=30, variables=0, display=2, refs=6, slots=0, visibleChoices=0

```text
A grandfather clock shows a time of 7 o clock. What is the exact radian measure of the angle between the hour hand and the minute hand?
```

## record-43 @ 650860

- Metadata: Difficult | Section 4.3 | Section 4.4 | T3 |T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | radians | primary trigonometric ratios | trigonometric equations
- Counts: strings=511, variables=0, display=2, refs=62, slots=0, visibleChoices=0

```text
A 150-cm-tall person stands on the bank of a narrow river and observes a flagpole on the opposite bank. If the angle of elevation to the top of the flagpole is 0.25 and the angle of depression to the bottom of the flagpole is 0.09, determine the flagpole s height, in metres, to two decimal places.
```

## record-44 @ 709882

- Metadata: Difficult | Section 4.3 | Section 4.4 | T3 | T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | volume | trigonometric ratios | trigonometric equations | radians
- Counts: strings=249, variables=0, display=2, refs=83, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The volume of a drinking cup can be approximated by the formula [[slot]], where the top and bottom of the cup are circular and h is the height. If the cup has a bottom diameter of 6 cm, a height of 10 cm, and sides that slope outward at an angle of 0.09, determine the cup s volume.
```

Inline slots:
- #1 math-object ref=- value=- offset=710420
  context: The volume of a drinking cup can be approximated by the formula [[slot]], where the top and bottom of the cup are circular and h is the height. If the cup has a b

## record-45 @ 765409

- Metadata: Easy | Section 4.3 | Section 4.4 | T3 | T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | trigonometric ratios | special angles | trigonometric equations
- Counts: strings=68, variables=0, display=2, refs=11, slots=0, visibleChoices=0

```text
To support a new 2.5-m wall in the construction of a home, the carpenters nail a piece of wood from the top of the wall to the floor, with the piece of wood forming the hypotenuse of the right triangle it makes with the wall and floor. The piece of wood is nailed to the ground such that it makes a 30 angle with the floor.a) Represent this situation with a diagram.b) Which trigonometric ratio can be used to determine the length of the piece of wood?c) Determine the length of the piece of wood.
```

## record-46 @ 779183

- Metadata: Average | Section 4.3 | Section 4.4 | T3 | T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | special angles | primary trigonometric ratios | right triangle
- Counts: strings=199, variables=0, display=3, refs=23, slots=0, visibleChoices=0

```text
Two wires are connected to a tower at the same point on the tower. Wire #1 makes an angle of 45 with the ground and wire #2 makes an angle of 60 with the ground.a) Represent this situation with a diagram.b) Which wire is longer? Explain.c) If the point where the two wires connect to the tower is 35 m above the ground, determine exact expressions for the lengths of the two wires.d) Determine the length of each wire, to the nearest tenth of a metre.e) How do your answers to parts b) and d) compare?
```

## record-47 @ 811124

- Metadata: Average | Section 4.3 | Section 4.4 | T3 | T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | two-dimensional problem | special angles | right triangle
- Counts: strings=284, variables=0, display=4, refs=44, slots=0, visibleChoices=0

```text
Sarah and Simone are walking in a walk-a-thon down a straight street that leads to the finish line in the park. At the same time, they both notice a hot-air balloon directly over the finish line. Sarah sees the angle from the ground to the balloon as 30 and Simone, who is 0.25 km closer to the finish line than Sarah, sees the angle from the ground to the balloon as 45.a) Draw a diagram to represent this situation.b) If x represents the distance that Simone is from the finish line, write an expression for the distance from Sarah to the finish line.c) Write a trigonometric ratio for each girl s position that involves the height of the balloon, h; the distance, x, each girl is away from the finish line; and the angle from the girl to the balloon.d) Rearrange each equation from part c) to isolate h.e) Set the two expressions for h equal to each other and solve for x, to the nearest hundredth of a kilometre.f) Determine the height of the balloon, to the nearest hundredth of a kilometre.
```

## record-48 @ 867746

- Metadata: Difficult | Section 4.3 | Section 4.4 | T3 | T5 | Trigonometric Ratios | Introduction to Trigonometric Equations | two-dimensional problem | trigonometric ratios | right triangle
- Counts: strings=85, variables=1, display=2, refs=19, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
A represent the angle that Gursant would measure. Let d represent the distance that Gursant is from the monument. Thus, [[slot]].[[slot]]Gursant would measure an angle of 30 from the ground to the top of the monument.
```

Variables:
- e = ?  rule: `Draw a diagram of the situation.[[slot]]Let x represent the distance that Leo is from the base of the monument.[[slot]]Let`

Inline slots:
- #1 unknown-object ref=- value=- offset=869634
  context: sant would measure. Let d represent the distance that Gursant is from the monument. Thus, [[slot]]. [[slot]] Gursant would measure an angle of 30
- #2 unknown-object ref=- value=- offset=869640
  context: measure. Let d represent the distance that Gursant is from the monument. Thus, [[slot]]. [[slot]] Gursant would measure an angle of 30

## record-49 @ 895500

- Metadata: Average | Section 4.2 | Section 4.3 | T2 | T3 | Unit Circle | Trigonometric Ratios | trigonometric ratios | reference angle | unit circle
- Counts: strings=173, variables=0, display=7, refs=50, slots=0, visibleChoices=0

```text
The point (–5, 7) is located on the terminal arm of A in standard position.a) Determine the primary trigonometric ratios for A.b) Determine the primary trigonometric ratios for B with the same sine as A, but different signs for the other two primary trigonometric ratios.c) Use a calculator to determine the measures of A and B, to the nearest degree.
```

## record-50 @ 905189

- Metadata: Average | Section 4.2 | Section 4.3 | T2 | T3 | Unit Circle | Trigonometric Ratios | sine ratio | reference angle | unit circle
- Counts: strings=572, variables=0, display=3, refs=94, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) Without using a calculator, determine two angles between 0 and 360 that have a sine ratio of [[slot]].b) Use a calculator and a diagram to verify your answers to part a).
```

Inline slots:
- #1 diagram-object ref=- value=- offset=905687
  context: that have a sine ratio of [[slot]]. b) Use a calculator and a diagram to verify your answers to part a).

## record-51 @ 1108355

- Metadata: Average | Section 4.2 | Section 4.3 | T2 | T3 | Unit Circle | Trigonometric Ratios | trigonometric ratios | unit circle | reference angle
- Counts: strings=779, variables=0, display=1, refs=147, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A such that cos A = [[slot]].a) In which quadrant(s) is this angle? Explain.b) If the sine of the angle is negative, in which quadrant is the angle? Explain.c) Sketch a diagram to represent the angle in standard position, given that the condition in part b) is true.d) Find the coordinates of a point on the terminal arm of the angle.e) Write exact expressions for the other two primary trigonometric ratios for the angle.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1108739
  context: A such that cos A = [[slot]]. a) In which quadrant(s) is this angle? Explain. b) If the sine of the angle is negative,

## record-52 @ 1228323

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | two-dimensional problem | ambiguous case | sine law
- Counts: strings=634, variables=1, display=1, refs=109, slots=0, visibleChoices=0

```text
A in each diagram.d) Calculate the length of BC in each diagram.
```

Variables:
- In = ?  rule: `ABC, c = 11 cm, b = 7 cm, and`

## record-53 @ 1385765

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | special angles | trigonometric ratios | area
- Counts: strings=90, variables=0, display=2, refs=22, slots=0, visibleChoices=0

```text
A rectangle has a diagonal of 8 cm. The diagonal creates a 60 angle at the base of the rectangle. a) Write an exact expression for the base and the height of the rectangle.b) Use your expressions to find the exact area of the rectangle.
```

## record-54 @ 1390957

- Metadata: Easy | Section 4.3 | T3 | Trigonometric Ratios | cosine law | two-dimensional problem
- Counts: strings=36, variables=0, display=1, refs=5, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Let x represent the width of the canyon. Use the cosine law.[[slot]]The width of the canyon is approximately 173.3 m.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=1392389
  context: Let x represent the width of the canyon. Use the cosine law. [[slot]] The width of the canyon is approximately 173.3 m.

## record-55 @ 1394146

- Metadata: Average | Section 4.3 | T3 | Trigonometric Ratios | trigonometric ratios | three-dimensional problem
- Counts: strings=126, variables=0, display=3, refs=13, slots=0, visibleChoices=0

```text
Simon is due north of a tall totem pole and walks 75 m, 40 west of south. From his new position, the totem pole is due east, with an angle of elevation of 17. Determine the height of the totem pole, to the nearest tenth of a metre.
```

## record-56 @ 1516629

- Metadata: Average | Section 4.2 | Section 4.3 | T2 | T3 | Unit Circle | Trigonometric Ratios | trigonometric ratios | reference angle | co-terminal angles | unit circle
- Counts: strings=36, variables=0, display=4, refs=1, slots=0, visibleChoices=0

```text
a) For the given trigonometric ratio, determine two other angles that have the same value.i) sin 45 ii) tan 300 iii) cos 120 b) Explain how you determined the angles in part a).
```

## record-57 @ 1519797

- Metadata: Average | Section 4.2 | Section 4.3 | T2 | T3 | Unit Circle | Trigonometric Ratios | primary trigonometric ratios | reciprocal trigonometric ratios | point on terminal arm
- Counts: strings=143, variables=0, display=1, refs=41, slots=0, visibleChoices=0

```text
The point P(–3, –6) lies on the terminal arm of an angle in standard position.a) Which primary trigonometric ratios are positive and which are negative?b) Which reciprocal trigonometric ratios are positive and which are negative?c) Determine exact values for the primary trigonometric ratios.d) Determine exact values for the reciprocal trigonometric ratios.
```

## record-58 @ 1528232

- Metadata: Easy | Section 4.1 | T1 | Angles and Angle Measure | central angle | arc length
- Counts: strings=31, variables=0, display=1, refs=6, slots=0, visibleChoices=0

```text
Darren cuts a slice from his circular birthday cake, which has a diameter of 30 cm. The slice is in the shape of a sector with arc length 8 cm. What is the measure of the central angle of the slice, in radians, rounded to two decimal places?
```

## record-59 @ 1530911

- Metadata: Average | Section 4.1 | T1 | Angles and Angle Measure | angular velocity
- Counts: strings=33, variables=0, display=1, refs=10, slots=0, visibleChoices=0

```text
A bicycle tire revolves at 150 rpm (revolutions per minute). What is its angular velocity, in radians per second, rounded to two decimal places?
```

## record-60 @ 1533418

- Metadata: Average | Section 4.4 | T5 | Introduction to Trigonometric Equations | sine ratio | algebraic solution
- Counts: strings=273, variables=0, display=1, refs=120, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A group of marketing students are creating a strategy to sell ceiling fans. They determine that the number of sales will vary according to the month of the year. The formula [[slot]] gives the expected sales, in thousands, according to the month, t, where t = 1 represents January, t = 2 is February, and so on.a) In which month are sales of fans expected to reach 11 600?b) In which month are sales expected to be the least?c) Does this formula seem reasonable? Explain.
```

Inline slots:
- #1 math-object ref=- value=- offset=1534020
  context: ermine that the number of sales will vary according to the month of the year. The formula [[slot]] gives the expected sales, in thousands, according to the month, t, where t = 1 represents

