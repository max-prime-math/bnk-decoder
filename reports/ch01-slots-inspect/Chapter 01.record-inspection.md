# Record Inspection: Chapter 01.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 11/Chapter 01.bnk`
- Inflated bytes: 542356
- Records: 76
- Inline slots: 331
- Slot classes: variable-ref=291, unknown-object=33, math-object=7

## record-1 @ 4628

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | nth term
- Counts: strings=127, variables=11, display=5, refs=12, slots=9, visibleChoices=4

```text
Which of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],...? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = –12  rule: `range(-20,50,1)`
- t2 = –8  rule: `t1+n`
- n = 4  rule: `range(-10,10,1)`
- t3 = –4  rule: `t1+2*n`
- t4 = 0  rule: `t1+3*n`
- t5 = 4  rule: `t1+4*n`
- tn = 24  rule: `t1+d*n`
- d2 = 15  rule: `t1+d*(n-1)`
- d3 = 6  rule: `t1+d*(n-2)`
- d1 = –3  rule: `t1+d*(n-3)`
- d = 9  rule: `range(7,12,1)`

Inline slots:
- #1 variable-ref ref=t1 value=–12 offset=5986
  context: Which of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . .?
- #2 variable-ref ref=t2 value=–8 offset=5992
  context: Which of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . .?
- #3 variable-ref ref=t3 value=–4 offset=5998
  context: Which of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . .?
- #4 variable-ref ref=t4 value=0 offset=6004
  context: Which of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . .?
- #5 variable-ref ref=t5 value=4 offset=6010
  context: h of the following numbers occurs in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . .?
- #6 variable-ref ref=d3 value=6 offset=6034
  context: [[slot]]
- #7 variable-ref ref=tn value=24 offset=6042
  context: [[slot]]
- #8 variable-ref ref=d1 value=–3 offset=6052
  context: [[slot]]
- #9 variable-ref ref=d2 value=15 offset=6060
  context: [[slot]]

## record-2 @ 9022

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | common difference
- Counts: strings=110, variables=9, display=5, refs=9, slots=8, visibleChoices=4

```text
The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]],... is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = 2  rule: `range(-10,10,1)`
- t2 = –6  rule: `t1+n`
- t3 = –14  rule: `t1+2*n`
- n = –8  rule: `range(-8,8,1)`
- t4 = –22  rule: `t1+3*n`
- d1 = –16  rule: `2*n`
- d2 = 8  rule: `-n`
- d3 = -3  rule: `fracs(t2,t1)`
- f = –0.333333333333  rule: `t1/t2`

Inline slots:
- #1 variable-ref ref=t1 value=2 offset=10174
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #2 variable-ref ref=t2 value=–6 offset=10180
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #3 variable-ref ref=t3 value=–14 offset=10186
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #4 variable-ref ref=t4 value=–22 offset=10192
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #5 variable-ref ref=n value=–8 offset=10220
  context: [[slot]]
- #6 variable-ref ref=d1 value=–16 offset=10228
  context: [[slot]]
- #7 variable-ref ref=d3 value=-3 offset=10238
  context: [[slot]]
- #8 variable-ref ref=d2 value=8 offset=10246
  context: [[slot]]

## record-3 @ 13224

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | common difference | fraction
- Counts: strings=120, variables=11, display=5, refs=12, slots=9, visibleChoices=4

```text
The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],... is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- a = 1  rule: `range(1,b-1,1)`
- b = 2  rule: `range(2,9,1)`
- t1 = 1/2  rule: `fracs(a,b)`
- t2 = 5/6  rule: `fracs((a*d+b),(b*d))`
- d = 3  rule: `range(2,4,1)`
- t3 = 7/6  rule: `fracs((a*d+2*b),(b*d))`
- t4 = 3/2  rule: `fracs((a*d+3*b),(b*d))`
- t5 = 11/6  rule: `fracs((a*d+4*b),(b*d))`
- D1 = 5/12  rule: `fracs((a*(a*d+b)),(b^2*d))`
- D2 = 9  rule: `d^2`
- f = 0.416666666667  rule: `(a*(a*d+b))/(b^2*d)`

Inline slots:
- #1 variable-ref ref=t1 value=1/2 offset=14700
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #2 variable-ref ref=t2 value=5/6 offset=14706
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #3 variable-ref ref=t3 value=7/6 offset=14712
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #4 variable-ref ref=t4 value=3/2 offset=14718
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #5 variable-ref ref=t5 value=11/6 offset=14724
  context: The common difference in the arithmetic sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #6 variable-ref ref=D1 value=5/12 offset=14752
  context: [[slot]]
- #7 variable-ref ref=D2 value=9 offset=14760
  context: [[slot]]
- #8 variable-ref ref=d value=3 offset=14770
  context: [[slot]]
- #9 variable-ref ref=d value=3 offset=14778
  context: [[slot]]

## record-4 @ 17819

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | common difference | general term
- Counts: strings=102, variables=4, display=6, refs=20, slots=6, visibleChoices=5

```text
In the formula for the general term of an arithmetic sequence tn = [[slot]] + (n – 1) ([[slot]]), the common difference is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]
- H. o

Variables:
- t1 = –7  rule: `range(-20,20,1)`
- d = –2.5  rule: `range(-10,10,0.25)`
- D1 = –4.5  rule: `t1-d`
- D2 = 17.5  rule: `t1*d`

Inline slots:
- #1 variable-ref ref=t1 value=–7 offset=18857
  context: In the formula for the general term of an arithmetic sequence tn = [[slot]] + (n – 1)
- #2 variable-ref ref=d value=–2.5 offset=18885
  context: ([[slot]]), the common difference is
- #3 variable-ref ref=D2 value=17.5 offset=18949
  context: [[slot]]
- #4 variable-ref ref=D1 value=–4.5 offset=18957
  context: [[slot]]
- #5 variable-ref ref=t1 value=–7 offset=18967
  context: [[slot]]
- #6 variable-ref ref=d value=–2.5 offset=18975
  context: [[slot]]

## record-5 @ 21667

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | general term | arithmetic sequence
- Counts: strings=132, variables=10, display=5, refs=42, slots=9, visibleChoices=4

```text
Which of the given formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],... is correct? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = –9  rule: `range(-40,40,1)`
- d = 8  rule: `range(-10,10,1)`
- t2 = –1  rule: `t1+d`
- t3 = 7  rule: `t1+2*d`
- t4 = 15  rule: `t1+3*d`
- t5 = 23  rule: `t1+4*d`
- sign = –  rule: `sgns(t1-d)`
- c = 17  rule: `abs(t1-d)`
- negd = –8  rule: `-d`
- newc = 1  rule: `abs(t1+d)`

Inline slots:
- #1 variable-ref ref=d value=8 offset=22931
  context: Which of the given formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is correct?
- #2 variable-ref ref=d value=8 offset=22937
  context: Which of the given formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is correct?
- #3 variable-ref ref=t1 value=–9 offset=22943
  context: Which of the given formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is correct?
- #4 variable-ref ref=t2 value=–1 offset=22949
  context: of the given formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is correct?
- #5 variable-ref ref=t3 value=7 offset=22955
  context: ven formulas for the general term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], . . . is correct?
- #6 variable-ref ref=t4 value=15 offset=23001
  context: [[slot]]
- #7 variable-ref ref=t5 value=23 offset=23009
  context: [[slot]]
- #8 variable-ref ref=negd value=–8 offset=23019
  context: [[slot]]
- #9 variable-ref ref=sign value=– offset=23027
  context: [[slot]]

## record-6 @ 26513

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | terms | arithmetic sequence
- Counts: strings=121, variables=10, display=5, refs=12, slots=10, visibleChoices=4

```text
What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]], [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = 18  rule: `range(8,20,1)`
- t1 = –22  rule: `range(-30,30,1)`
- d = 0.8  rule: `range(-10,10,0.2)`
- t2 = –21.2  rule: `t1+d`
- t3 = –20.4  rule: `t1+2*d`
- t4 = –19.6  rule: `t1+3*d`
- t5 = –18.8  rule: `t1+4*d`
- tn = –8.4  rule: `t1+(n-1)*d`
- D1 = –35.6  rule: `t1-(n-1)*d`
- D2 = –6.8  rule: `t1+(n+1)*d`

Inline slots:
- #1 variable-ref ref=n value=18 offset=27811
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #2 variable-ref ref=t1 value=–22 offset=27861
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #3 variable-ref ref=t2 value=–21.2 offset=27867
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #4 variable-ref ref=t3 value=–20.4 offset=27873
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #5 variable-ref ref=t4 value=–19.6 offset=27879
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #6 variable-ref ref=t5 value=–18.8 offset=27885
  context: What is the [[slot]]th term of the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #7 variable-ref ref=D2 value=–6.8 offset=27901
  context: [[slot]]
- #8 variable-ref ref=tn value=–8.4 offset=27909
  context: [[slot]]
- #9 variable-ref ref=d value=0.8 offset=27919
  context: [[slot]]
- #10 variable-ref ref=D1 value=–35.6 offset=27927
  context: [[slot]]

## record-7 @ 31233

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | sum | number of terms | arithmetic series
- Counts: strings=127, variables=10, display=5, refs=13, slots=9, visibleChoices=4

```text
The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 3 5 7 9

Variables:
- t1 = –5  rule: `range(-9,9,1)`
- t2 = –7  rule: `t1+d`
- d = –2  rule: `range(-5,5,1)`
- t3 = –9  rule: `t1+(2*d)`
- n = 8  rule: `range(5,10,1)`
- tn = –19  rule: `t1+(n-1)*d`
- ANS = –96  rule: `(n/2)*(t1+tn)`
- DIS1 = 26  rule: `(d/2)*(2*t1+n*d)`
- DIS2 = –192  rule: `n*(t1+tn)`
- DIS3 = –304  rule: `(2*n)*(t1+(n-1)*d)`

Inline slots:
- #1 variable-ref ref=t1 value=–5 offset=32591
  context: The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is
- #2 variable-ref ref=t2 value=–7 offset=32603
  context: The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is
- #3 variable-ref ref=t3 value=–9 offset=32615
  context: The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is
- #4 variable-ref ref=d value=–2 offset=32625
  context: The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is
- #5 variable-ref ref=d value=–2 offset=32635
  context: The sum of the series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]) is
- #6 variable-ref ref=d value=–2 offset=32651
  context: [[slot]]
- #7 variable-ref ref=d value=–2 offset=32659
  context: [[slot]]
- #8 variable-ref ref=tn value=–19 offset=32669
  context: [[slot]]
- #9 variable-ref ref=ANS value=–96 offset=32677
  context: [[slot]]

## record-8 @ 35972

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=116, variables=8, display=5, refs=8, slots=7, visibleChoices=4

```text
The sum of an arithmetic series where t1 = [[slot]], t3 = [[slot]], and n = [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = –2  rule: `range(-10,10,1)`
- t3 = 7  rule: `t1+(2*d)`
- d = 4.5  rule: `range(-8,8,0.5)`
- n = 15  rule: `range(6,20,1)`
- ANS = 442.5  rule: `(n/2)*(2*t1+(n-1)*d)`
- DIS1 = 885  rule: `2*ANS`
- DIS2 = 476.25  rule: `(n/2)*(2*t1+(n)*d)`
- DIS3 = –502.5  rule: `(n/2)*(2*t1-(n-1)*d)`

Inline slots:
- #1 variable-ref ref=t1 value=–2 offset=37234
  context: The sum of an arithmetic series where t1 = [[slot]], t3 = [[slot]], and n = [[slot]] is
- #2 variable-ref ref=t3 value=7 offset=37250
  context: The sum of an arithmetic series where t1 = [[slot]], t3 = [[slot]], and n = [[slot]] is
- #3 variable-ref ref=n value=15 offset=37272
  context: The sum of an arithmetic series where t1 = [[slot]], t3 = [[slot]], and n = [[slot]] is
- #4 variable-ref ref=DIS3 value=–502.5 offset=37286
  context: [[slot]]
- #5 variable-ref ref=DIS2 value=476.25 offset=37294
  context: [[slot]]
- #6 variable-ref ref=ANS value=442.5 offset=37304
  context: [[slot]]
- #7 variable-ref ref=DIS1 value=885 offset=37312
  context: [[slot]]

## record-9 @ 40090

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=115, variables=8, display=5, refs=9, slots=7, visibleChoices=4

```text
The sum of an arithmetic series where [[slot]], [[slot]], and n = [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- NUM = 2  rule: `range(2,9,1)`
- d = 3  rule: `range(-9,9,1)`
- n = 19  rule: `range(5,60,1)`
- ANS = 1045/2  rule: `fracs(n*(2+(n-1)*d*NUM),2*NUM)`
- DIS2 = 1045  rule: `fracs(n*(2+(n-1)*d*NUM),NUM)`
- DIS3 = 551  rule: `fracs(n*(2+n*d*num),2*num)`
- DIS1 = 165/2  rule: `fracs(d*(2+(n-1)*d*num),2*num)`
- t1 = 0.5  rule: `1/NUM`

Inline slots:
- #1 variable-ref ref=NUM value=2 offset=41378
  context: The sum of an arithmetic series where [[slot]], [[slot]], and n = [[slot]] is
- #2 variable-ref ref=d value=3 offset=41384
  context: The sum of an arithmetic series where [[slot]], [[slot]], and n = [[slot]] is
- #3 variable-ref ref=n value=19 offset=41406
  context: The sum of an arithmetic series where [[slot]], [[slot]], and n = [[slot]] is
- #4 variable-ref ref=DIS3 value=551 offset=41420
  context: [[slot]]
- #5 variable-ref ref=ANS value=1045/2 offset=41428
  context: [[slot]]
- #6 variable-ref ref=DIS1 value=165/2 offset=41438
  context: [[slot]]
- #7 variable-ref ref=DIS2 value=1045 offset=41446
  context: [[slot]]

## record-10 @ 44324

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | explicit formula | number of terms | arithmetic series
- Counts: strings=176, variables=9, display=5, refs=34, slots=21, visibleChoices=5
- Suspicious: slot-without-variable-ref

```text
For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are [[slot]], d = [[slot]], n = [[slot]] [[slot]] = [[slot]], d = [[slot]], n = [[slot]] [[slot]] = [[slot]], d = [[slot]], n = [[slot]] [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
```

Choices:
- A. [[slot]], d = [[slot]], n = [[slot]]
- B. [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- C. [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- D. [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- G. _

Variables:
- t1 = 107  rule: `range(-300,300,1)`
- d = 23  rule: `range(-30,30,1)`
- n = 39  rule: `range(5,75,1)`
- t2 = 130  rule: `t1+d`
- t3 = 153  rule: `t1+2*d`
- tn = 981  rule: `t1+(n-1)*d`
- DISt1 = –107  rule: `-1*t1`
- DISd = –23  rule: `-1*d`
- DISn = 38  rule: `n-1`

Inline slots:
- #1 variable-ref ref=t1 value=107 offset=45484
  context: For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #2 variable-ref ref=t2 value=130 offset=45496
  context: For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #3 variable-ref ref=t3 value=153 offset=45508
  context: For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #4 variable-ref ref=d value=23 offset=45518
  context: For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #5 variable-ref ref=d value=23 offset=45528
  context: For the arithmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #6 variable-ref ref=d value=23 offset=45564
  context: hmetic series ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]] + ([[slot]]), the values of [[slot]], d, and n are
- #7 variable-ref ref=d value=23 offset=45600
  context: [[slot]], d = [[slot]], n = [[slot]]
- #8 variable-ref ref=tn value=981 offset=45614
  context: [[slot]], d = [[slot]], n = [[slot]]
- #9 variable-ref ref=t1 value=107 offset=45628
  context: [[slot]], d = [[slot]], n = [[slot]]
- #10 variable-ref ref=d value=23 offset=45636
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #11 variable-ref ref=n value=39 offset=45644
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #12 variable-ref ref=DISt1 value=–107 offset=45658
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #13 variable-ref ref=d value=23 offset=45672
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #14 variable-ref ref=DISn value=38 offset=45682
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #15 variable-ref ref=t1 value=107 offset=45690
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #16 variable-ref ref=DISd value=–23 offset=45704
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #17 variable-ref ref=n value=39 offset=45718
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #18 variable-ref ref=DISt1 value=–107 offset=45726
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #19 variable-ref ref=DISd value=–23 offset=45734
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #20 variable-ref ref=DISn value=38 offset=45748
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]
- #21 unknown-object ref=- value=- offset=45762
  context: [[slot]] = [[slot]], d = [[slot]], n = [[slot]]

## record-11 @ 51642

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=88, variables=9, display=7, refs=9, slots=7, visibleChoices=4

```text
in a jar. The next day, he places [[slot]] in the jar. The third day, he places [[slot]] in the jar, and so on for [[slot]] days. What amount will be in the jar at the end of this period of time? $[[slot]] $[[slot]] $[[slot]] $[[slot]]
```

Choices:
- A. $[[slot]]
- B. $[[slot]]
- C. $[[slot]]
- D. $[[slot]]

Variables:
- t1 = 5  rule: `rand(9)`
- d = 2  rule: `rand(5)`
- t2 = 7  rule: `t1+d`
- t3 = 9  rule: `t1+2*d`
- ANS = 6.72  rule: `((n/2)*(2*t1+(n-1)*d))/100`
- DIS1 = 6.96  rule: `((n/2)*(2*t1+n*d))/100`
- DIS2 = 6.12  rule: `((n/2)*(t1+(n-1)*d))/100`
- DIS3 = 6.36  rule: `((n/2)*(t1+n*d))/100`
- n = 24  rule: `range(15,60,1)`

Inline slots:
- #1 variable-ref ref=t1 value=5 offset=52936
  context: in a jar. The next day, he places [[slot]]
- #2 variable-ref ref=t2 value=7 offset=53016
  context: in the jar. The third day, he places [[slot]]
- #3 variable-ref ref=t3 value=9 offset=53074
  context: in the jar, and so on for [[slot]] days. What amount will be in the jar at the end of this period of time?
- #4 variable-ref ref=n value=24 offset=53230
  context: $[[slot]]
- #5 variable-ref ref=ANS value=6.72 offset=53240
  context: $[[slot]]
- #6 variable-ref ref=DIS1 value=6.96 offset=53252
  context: $[[slot]]
- #7 variable-ref ref=DIS3 value=6.36 offset=53262
  context: $[[slot]]

## record-12 @ 56060

- Metadata: Easy | Section 1.3 | RF 10 | Geometric Sequences | common ratio | geometric sequence
- Counts: strings=102, variables=5, display=5, refs=9, slots=8, visibleChoices=4

```text
The common ratio for the geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],... is [[slot]] [[slot]] –[[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. –[[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = 8  rule: `range(-10,10,1)`
- rdenom = 8  rule: `range(2,10,1)`
- t2 = 1  rule: `t1*(1/rdenom)`
- t3 = 0.125  rule: `t2*(1/rdenom)`
- t4 = 0.015625  rule: `t3*(1/rdenom)`

Inline slots:
- #1 variable-ref ref=t1 value=8 offset=57050
  context: The common ratio for the geometric sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #2 variable-ref ref=t2 value=1 offset=57056
  context: The common ratio for the geometric sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #3 variable-ref ref=t3 value=0.125 offset=57062
  context: The common ratio for the geometric sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #4 variable-ref ref=t4 value=0.015625 offset=57068
  context: The common ratio for the geometric sequence [[slot]], [[slot]], [[slot]], [[slot]], . . . is
- #5 variable-ref ref=rdenom value=8 offset=57098
  context: [[slot]]
- #6 variable-ref ref=rdenom value=8 offset=57106
  context: [[slot]]
- #7 variable-ref ref=rdenom value=8 offset=57118
  context: –[[slot]]
- #8 variable-ref ref=rdenom value=8 offset=57126
  context: [[slot]]

## record-13 @ 60103

- Metadata: Difficult | Section 1.3 | RF 10 | Geometric Sequences | explicit formula | terms
- Counts: strings=78, variables=7, display=5, refs=7, slots=7, visibleChoices=4

```text
The population of a community was [[slot]] at the beginning of 2000. Assuming a rate of growth of [[slot]]% per year since 2000, what will the population be at the beginning of 20[[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- pop = 82 000  rule: `range(20000,100000,1000)`
- year = 25  rule: `range(20,35,1)`
- rate = 1.6  rule: `range(.5,4,.1)`
- ANS = 121 943  rule: `pop*pow(1+(rate/100),(year))`
- DIS1 = 120 023  rule: `pop*pow(1+(rate/100),year-1)`
- DIS2 = 123 894  rule: `pop*pow(1+(rate/100),(year+1))`
- DIS3 = 2 082 800  rule: `pop*(1+(rate/100))*year`

Inline slots:
- #1 variable-ref ref=pop value=82 000 offset=61333
  context: The population of a community was [[slot]] at the beginning of 2000. Assuming a rate of growth of [[slot]]% per year since 2000, wha
- #2 variable-ref ref=rate value=1.6 offset=61447
  context: lation of a community was [[slot]] at the beginning of 2000. Assuming a rate of growth of [[slot]]% per year since 2000, what will the population be at the beginning of 20[[slot]]?
- #3 variable-ref ref=year value=25 offset=61595
  context: rowth of [[slot]]% per year since 2000, what will the population be at the beginning of 20[[slot]]?
- #4 variable-ref ref=DIS2 value=123 894 offset=61605
  context: [[slot]]
- #5 variable-ref ref=ANS value=121 943 offset=61613
  context: [[slot]]
- #6 variable-ref ref=DIS3 value=2 082 800 offset=61623
  context: [[slot]]
- #7 variable-ref ref=DIS1 value=120 023 offset=61631
  context: [[slot]]

## record-14 @ 64313

- Metadata: Easy | Section 1.3 | RF 10 | Geometric Sequences | common ratio | explicit formula | geometric sequence
- Counts: strings=91, variables=3, display=5, refs=18, slots=5, visibleChoices=4

```text
In the formula for the general term of a geometric sequence [[slot]], the common ratio is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 4  rule: `rand(9)`
- denom = 5  rule: `rand(9)`
- t1 = –10  rule: `range(-15,15,1)`

Inline slots:
- #1 variable-ref ref=t1 value=–10 offset=65327
  context: In the formula for the general term of a geometric sequence [[slot]], the common ratio is
- #2 variable-ref ref=num value=4 offset=65379
  context: [[slot]]
- #3 variable-ref ref=denom value=5 offset=65387
  context: [[slot]]
- #4 variable-ref ref=denom value=5 offset=65397
  context: [[slot]]
- #5 variable-ref ref=num value=4 offset=65405
  context: [[slot]]

## record-15 @ 68114

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | terms | geometric sequence
- Counts: strings=111, variables=7, display=5, refs=12, slots=8, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The eighth term in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 1 3 5 7

Variables:
- t1 = 3 515 625  rule: `pow(n,8)*rand(9)`
- t2 = 703 125  rule: `t1/n`
- t3 = 140 625  rule: `t2/n`
- t4 = 28 125  rule: `t3/n`
- n = 5  rule: `range(2,5,1)`
- ANS = 45  rule: `t1/(pow(n,7))`
- DIS2 = 9  rule: `t1/(pow(n,8))`

Inline slots:
- #1 variable-ref ref=t1 value=3 515 625 offset=69236
  context: The eighth term in the sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #2 variable-ref ref=t2 value=703 125 offset=69242
  context: The eighth term in the sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #3 variable-ref ref=t3 value=140 625 offset=69248
  context: The eighth term in the sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #4 variable-ref ref=t4 value=28 125 offset=69254
  context: The eighth term in the sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #5 variable-ref ref=DIS2 value=9 offset=69274
  context: [[slot]]
- #6 variable-ref ref=ANS value=45 offset=69282
  context: [[slot]]
- #7 variable-ref ref=DIS2 value=9 offset=69292
  context: [[slot]]
- #8 unknown-object ref=- value=- offset=69300
  context: [[slot]]

## record-16 @ 72183

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | terms | geometric sequence
- Counts: strings=118, variables=12, display=5, refs=9, slots=8, visibleChoices=4

```text
The [[slot]]th term in the sequence [[slot]], 1, [[slot]], [[slot]],... is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 2 4 6 8

Variables:
- a = 4  rule: `range(2,9,1)`
- b = 7  rule: `range(3,9,1)`
- n = 6  rule: `range(6,9,1)`
- bsqr = 49  rule: `pow(b,2)`
- asqr = 16  rule: `pow(a,2)`
- t1 = 4/7  rule: `fracs(a,b)`
- t3 = 7/4  rule: `fracs(b,a)`
- t4 = 49/16  rule: `fracs(bsqr,asqr)`
- ANS = 2401/256  rule: `fracs(b^(n-2),a^(n-2))`
- DIS1 = 256/2401  rule: `fracs(a^(n-2),b^(n-2))`
- DIS2 = 2401/4096  rule: `fracs(b^(n-2),a^n)`
- DIS3 = 117649/4096  rule: `fracs(b^n,a^n)`

Inline slots:
- #1 variable-ref ref=n value=6 offset=73707
  context: The [[slot]]th term in the sequence [[slot]], 1, [[slot]], [[slot]], . . . is
- #2 variable-ref ref=t1 value=4/7 offset=73757
  context: The [[slot]]th term in the sequence [[slot]], 1, [[slot]], [[slot]], . . . is
- #3 variable-ref ref=t3 value=7/4 offset=73769
  context: The [[slot]]th term in the sequence [[slot]], 1, [[slot]], [[slot]], . . . is
- #4 variable-ref ref=t4 value=49/16 offset=73775
  context: The [[slot]]th term in the sequence [[slot]], 1, [[slot]], [[slot]], . . . is
- #5 variable-ref ref=DIS2 value=2401/4096 offset=73803
  context: [[slot]]
- #6 variable-ref ref=DIS1 value=256/2401 offset=73811
  context: [[slot]]
- #7 variable-ref ref=ANS value=2401/256 offset=73821
  context: [[slot]]
- #8 variable-ref ref=DIS3 value=117649/4096 offset=73829
  context: [[slot]]

## record-17 @ 76627

- Metadata: Easy | Section 1.3 | RF 10 | Geometric Sequences | terms | explicit formula | geometric sequence
- Counts: strings=135, variables=11, display=5, refs=17, slots=13, visibleChoices=4

```text
The first three terms of the sequence given by [[slot]] are [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]] [[slot]], [[slot]], [[slot]]
```

Choices:
- A. [[slot]], [[slot]], [[slot]]
- B. [[slot]], [[slot]], [[slot]]
- C. [[slot]], [[slot]], [[slot]]
- D. [[slot]], [[slot]], [[slot]] 5 7

Variables:
- a = 11  rule: `range(2,15,1)`
- r = 4  rule: `range(3,9,1)`
- rsqr = 16  rule: `pow(r,2)`
- DIS1a = 11/64  rule: `fracs(a,r^3)`
- DIS2 = 121  rule: `pow(a,2)`
- DIS3 = 1331  rule: `pow(a,3)`
- DIS4 = 11/3  rule: `fracs(a,r-1)`
- DIS5 = 11/9  rule: `fracs(a,(r-1)^2)`
- ANSa = 11  rule: `fracs(a,1)`
- ANSb = 11/4  rule: `fracs(a,r)`
- ANSc = 11/16  rule: `fracs(a,r^2)`

Inline slots:
- #1 variable-ref ref=a value=11 offset=78011
  context: The first three terms of the sequence given by [[slot]] are
- #2 variable-ref ref=r value=4 offset=78027
  context: [[slot]], [[slot]], [[slot]]
- #3 variable-ref ref=a value=11 offset=78033
  context: [[slot]], [[slot]], [[slot]]
- #4 variable-ref ref=DIS2 value=121 offset=78039
  context: [[slot]], [[slot]], [[slot]]
- #5 variable-ref ref=DIS3 value=1331 offset=78047
  context: [[slot]], [[slot]], [[slot]]
- #6 variable-ref ref=ANSb value=11/4 offset=78053
  context: [[slot]], [[slot]], [[slot]]
- #7 variable-ref ref=ANSc value=11/16 offset=78059
  context: [[slot]], [[slot]], [[slot]]
- #8 variable-ref ref=DIS1a value=11/64 offset=78069
  context: [[slot]], [[slot]], [[slot]]
- #9 variable-ref ref=ANSa value=11 offset=78075
  context: [[slot]], [[slot]], [[slot]]
- #10 variable-ref ref=ANSb value=11/4 offset=78081
  context: [[slot]], [[slot]], [[slot]]
- #11 variable-ref ref=ANSc value=11/16 offset=78089
  context: [[slot]], [[slot]], [[slot]]
- #12 variable-ref ref=a value=11 offset=78095
  context: [[slot]], [[slot]], [[slot]]
- #13 variable-ref ref=DIS4 value=11/3 offset=78101
  context: [[slot]], [[slot]], [[slot]]

## record-18 @ 81914

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | number of terms | geometric sequence
- Counts: strings=123, variables=11, display=6, refs=11, slots=10, visibleChoices=4

```text
How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],, [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 8

Variables:
- t1 = 2  rule: `range(2,9,1)`
- r = 4  rule: `range(2,9,1)`
- n = 11  rule: `range(7,15,1)`
- t2 = 8  rule: `t1*r`
- t3 = 32  rule: `t2*r`
- t4 = 128  rule: `t3*r`
- t5 = 512  rule: `t4*r`
- tn = 2 097 152  rule: `t1*pow(r,(n-1))`
- DIS1 = 10  rule: `n-1`
- DIS2 = 9  rule: `n-2`
- DIS3 = 12  rule: `n+1`

Inline slots:
- #1 variable-ref ref=t1 value=2 offset=83052
  context: How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #2 variable-ref ref=t2 value=8 offset=83058
  context: How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #3 variable-ref ref=t3 value=32 offset=83064
  context: How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #4 variable-ref ref=t4 value=128 offset=83070
  context: How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #5 variable-ref ref=t5 value=512 offset=83076
  context: How many terms are in the sequence [[slot]], [[slot]], [[slot]], [[slot]], [[slot]],
- #6 variable-ref ref=tn value=2 097 152 offset=83088
  context: , [[slot]]?
- #7 variable-ref ref=DIS2 value=9 offset=83098
  context: [[slot]]
- #8 variable-ref ref=DIS1 value=10 offset=83106
  context: [[slot]]
- #9 variable-ref ref=DIS3 value=12 offset=83116
  context: [[slot]]
- #10 variable-ref ref=n value=11 offset=83124
  context: [[slot]]

## record-19 @ 86250

- Metadata: Easy | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=110, variables=8, display=5, refs=8, slots=7, visibleChoices=4

```text
The sum of a geometric series where [[slot]], r = [[slot]], and n = [[slot]] is approximately [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- adenom = 3  rule: `range(2,9,1)`
- r = 2  rule: `range(2,5,1)`
- n = 3  rule: `range(3,6,1)`
- ANS = 2.3  rule: `(t1*(pow(r,n)-1))/(r-1)`
- DIS1 = 2.7  rule: `(t1*(pow(n,r)-1))/(r-1)`
- DIS2 = 1.3  rule: `(t1*(pow(r,(n-1))))/(r-1)`
- DIS3 = 1.2  rule: `(t1*(pow(r,n)-1))/r`
- t1 = 0  rule: `1/adenom`

Inline slots:
- #1 variable-ref ref=adenom value=3 offset=87404
  context: The sum of a geometric series where [[slot]], r = [[slot]], and n = [[slot]] is approximately
- #2 variable-ref ref=r value=2 offset=87418
  context: The sum of a geometric series where [[slot]], r = [[slot]], and n = [[slot]] is approximately
- #3 variable-ref ref=n value=3 offset=87440
  context: The sum of a geometric series where [[slot]], r = [[slot]], and n = [[slot]] is approximately
- #4 variable-ref ref=ANS value=2.3 offset=87482
  context: [[slot]]
- #5 variable-ref ref=DIS1 value=2.7 offset=87490
  context: [[slot]]
- #6 variable-ref ref=DIS2 value=1.3 offset=87500
  context: [[slot]]
- #7 variable-ref ref=DIS3 value=1.2 offset=87508
  context: [[slot]]

## record-20 @ 90341

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | number of terms | geometric series
- Counts: strings=127, variables=10, display=5, refs=13, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 5 7 9

Variables:
- r = 5  rule: `range(2,5,1)`
- t1 = 14  rule: `rand(15)`
- t2 = 70  rule: `t1*r`
- t3 = 350  rule: `t2*r`
- tn = 43 750  rule: `t1*pow(r,(n-1))`
- n = 6  rule: `range(5,9,1)`
- ANS = 54 684  rule: `(t1*(pow(r,n)-1))/(r-1)`
- DIS1 = 54 688  rule: `(t1*(pow(r,n)))/(r-1)`
- DIS2 = 10 938  rule: `(t1*(pow(r,(n-1))))/(r-1)`
- DIS3 = 8747  rule: `(t1*(pow(r,(n-1))-1))/r`

Inline slots:
- #1 variable-ref ref=t1 value=14 offset=91689
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #2 variable-ref ref=t2 value=70 offset=91697
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #3 variable-ref ref=t3 value=350 offset=91705
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #4 variable-ref ref=tn value=43 750 offset=91713
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #5 variable-ref ref=DIS3 value=8747 offset=91721
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #6 variable-ref ref=DIS1 value=54 688 offset=91735
  context: [[slot]]
- #7 variable-ref ref=DIS2 value=10 938 offset=91743
  context: [[slot]]
- #8 variable-ref ref=ANS value=54 684 offset=91753
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=91761
  context: [[slot]]

## record-21 @ 95056

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | number of terms | geometric series
- Counts: strings=130, variables=11, display=5, refs=13, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 5 7 9

Variables:
- n = 7  rule: `range(5,8,1)`
- r = 0.5  rule: `choose(rand(2),0.1,0.5)`
- t1 = 13  rule: `rand(15)`
- t2 = 6.5  rule: `t1*r`
- t3 = 3.25  rule: `t2*r`
- tn = 0.203125  rule: `t1*(pow(r,(n-1)))`
- ANS = 1651/64  rule: `fracs(t1*(q^n-1),q^(n-1)*(q-1))`
- DIS1 = 819/32  rule: `fracs(t1*(q^(n-1)-1),q^(n-2)*(q-1))`
- DIS2 = 1677/64  rule: `fracs(t1*(1+q^n),q^(n-1))`
- DIS3 = 559/64  rule: `fracs(t1*(1+q^n),q^(n-1)*(1+q))`
- q = 2  rule: `1/r`

Inline slots:
- #1 variable-ref ref=t1 value=13 offset=96582
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #2 variable-ref ref=t2 value=6.5 offset=96590
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #3 variable-ref ref=t3 value=3.25 offset=96598
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #4 variable-ref ref=tn value=0.203125 offset=96606
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #5 variable-ref ref=DIS3 value=559/64 offset=96614
  context: The sum of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #6 variable-ref ref=ANS value=1651/64 offset=96628
  context: [[slot]]
- #7 variable-ref ref=DIS2 value=1677/64 offset=96636
  context: [[slot]]
- #8 variable-ref ref=DIS1 value=819/32 offset=96646
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=96654
  context: [[slot]]

## record-22 @ 99949

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | terms | geometric series
- Counts: strings=128, variables=10, display=5, refs=17, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 6 8

Variables:
- n = 6  rule: `range(5,8,1)`
- r = 0.5  rule: `choose(rand(3),0.5,0.25,0.125)`
- t1 = 256  rule: `pow(4,(range(4,7)))`
- t2 = 128  rule: `t1*r`
- t3 = 64  rule: `t2*r`
- ANS = 8  rule: `fracs(t1,pow(q,(n-1)))`
- DIS1 = 4  rule: `fracs(t1,pow(q,n))`
- DIS2 = 2  rule: `fracs(t1,q^(n+1))`
- DIS3 = 64/9  rule: `fracs(t1,pow(n,q))`
- q = 2  rule: `1/r`

Inline slots:
- #1 variable-ref ref=n value=6 offset=101243
  context: The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #2 variable-ref ref=t1 value=256 offset=101309
  context: The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #3 variable-ref ref=t2 value=128 offset=101317
  context: The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #4 variable-ref ref=t3 value=64 offset=101325
  context: The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #5 variable-ref ref=DIS3 value=64/9 offset=101333
  context: The [[slot]]th term of the geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] is
- #6 variable-ref ref=ANS value=8 offset=101347
  context: [[slot]]
- #7 variable-ref ref=DIS1 value=4 offset=101355
  context: [[slot]]
- #8 variable-ref ref=DIS2 value=2 offset=101365
  context: [[slot]]
- #9 unknown-object ref=- value=- offset=101373
  context: [[slot]]

## record-23 @ 104668

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=135, variables=10, display=5, refs=14, slots=10, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = 9  rule: `range(7,19,1)`
- r = –3  rule: `range(-9,-2,1)`
- t1 = 8  rule: `range(2,9,1)`
- t2 = 24  rule: `-t1*r`
- t3 = 72  rule: `-t2*r`
- t4 = 216  rule: `-t3*r`
- ANS = 39 368  rule: `(t1*(pow(r,n)-1))/(r-1)`
- DIS1 = 39 366  rule: `(t1*(pow(r,n)))/(r-1)`
- DIS2 = 52 491  rule: `(t1*(pow(r,n)-1))/(r)`
- DIS3 = –13 122  rule: `(t1*(pow(r,(n-1))))/(r-1)`

Inline slots:
- #1 variable-ref ref=n value=9 offset=105952
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #2 variable-ref ref=t1 value=8 offset=105986
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #3 variable-ref ref=t2 value=24 offset=105994
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #4 variable-ref ref=t3 value=72 offset=106002
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #5 variable-ref ref=t4 value=216 offset=106010
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #6 variable-ref ref=DIS1 value=39 366 offset=106018
  context: What is the value of S[[slot]] for the series [[slot]] – [[slot]] + [[slot]] – [[slot]] + [[slot]] ?
- #7 variable-ref ref=DIS2 value=52 491 offset=106030
  context: [[slot]]
- #8 variable-ref ref=DIS3 value=–13 122 offset=106038
  context: [[slot]]
- #9 variable-ref ref=ANS value=39 368 offset=106048
  context: [[slot]]
- #10 unknown-object ref=- value=- offset=106056
  context: [[slot]]

## record-24 @ 109599

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=89, variables=5, display=5, refs=21, slots=5, visibleChoices=4

```text
If you researched your ancestors back [[slot]] generations, how many people would you need to research? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- n = 16  rule: `range(5,20,1)`
- ANS = 131 070  rule: `pow(2,(n+1))-2`
- DIS1 = 65 535  rule: `pow(2,n)-1`
- DIS2 = 262 140  rule: `2*ANS`
- DIS3 = 131 069  rule: `ANS-1`

Inline slots:
- #1 variable-ref ref=n value=16 offset=110459
  context: If you researched your ancestors back [[slot]] generations, how many people would you need to research?
- #2 variable-ref ref=n value=16 offset=110581
  context: [[slot]]
- #3 variable-ref ref=DIS2 value=262 140 offset=110589
  context: [[slot]]
- #4 variable-ref ref=DIS1 value=65 535 offset=110599
  context: [[slot]]
- #5 variable-ref ref=ANS value=131 070 offset=110607
  context: [[slot]]

## record-25 @ 112913

- Metadata: Average | Section 1.5 | RF 10 | Infinite Geometric Series | sum | infinite geometric series
- Counts: strings=111, variables=9, display=5, refs=9, slots=8, visibleChoices=4

```text
Determine the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] +... [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = 11  rule: `rand(50)`
- ANS = 33/2  rule: `fracs(t1*q,q-1)`
- DIS1 = 33/4  rule: `fracs(t1*q,1+q)`
- DIS2 = 33  rule: `str(t1*q)`
- DIS3 = 440/27  rule: `fracs(t1*(q^3+q^2+q+1),q^3)`
- q = 3  rule: `range(3,9,1)`
- t2 = 11/3  rule: `fracs(t1,q)`
- t3 = 11/9  rule: `fracs(t1,q^2)`
- t4 = 11/27  rule: `fracs(t1,q^3)`

Inline slots:
- #1 variable-ref ref=t1 value=11 offset=114217
  context: Determine the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] +...
- #2 variable-ref ref=t2 value=11/3 offset=114225
  context: Determine the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] +...
- #3 variable-ref ref=t3 value=11/9 offset=114233
  context: Determine the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] +...
- #4 variable-ref ref=t4 value=11/27 offset=114241
  context: Determine the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]] +...
- #5 variable-ref ref=DIS2 value=33 offset=114259
  context: [[slot]]
- #6 variable-ref ref=ANS value=33/2 offset=114267
  context: [[slot]]
- #7 variable-ref ref=DIS1 value=33/4 offset=114277
  context: [[slot]]
- #8 variable-ref ref=DIS3 value=440/27 offset=114285
  context: [[slot]]

## record-26 @ 117083

- Metadata: Average | Section 1.5 | RF 10 | Infinite Geometric Series | sum | infinite geometric series
- Counts: strings=117, variables=8, display=5, refs=15, slots=9, visibleChoices=4

```text
What is the sum of the infinite geometric series[[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = 15  rule: `rand(15)`
- ANS = 135  rule: `fracs(q*t1,q-p)`
- DIS1 = -120  rule: `fracs(t1*p,p-q)`
- DIS2 = 135/8  rule: `fracs(t1*q,p)`
- p = 8  rule: `rand(8)`
- q = 9  rule: `rand(9)`
- DIS3 = 135/17  rule: `fracs(q*t1,q+p)`
- r = 8/9  rule: `fracs(p,q)`

Inline slots:
- #1 variable-ref ref=t1 value=15 offset=118301
  context: What is the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]?
- #2 variable-ref ref=t1 value=15 offset=118309
  context: What is the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]?
- #3 variable-ref ref=r value=8/9 offset=118317
  context: What is the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]?
- #4 variable-ref ref=t1 value=15 offset=118325
  context: What is the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]?
- #5 variable-ref ref=r value=8/9 offset=118331
  context: at is the sum of the infinite geometric series [[slot]] + [[slot]] + [[slot]] + [[slot]]+ [[slot]]?
- #6 variable-ref ref=t1 value=15 offset=118341
  context: [[slot]]
- #7 variable-ref ref=r value=8/9 offset=118349
  context: [[slot]]
- #8 variable-ref ref=DIS1 value=-120 offset=118359
  context: [[slot]]
- #9 variable-ref ref=DIS2 value=135/8 offset=118367
  context: [[slot]]

## record-27 @ 121803

- Metadata: Easy | Section 1.5 | RF 10 | Infinite Geometric Series | sum | infinite geometric series
- Counts: strings=115, variables=8, display=5, refs=8, slots=6, visibleChoices=4

```text
Determine the sum of the infinite geometric series with t1 = [[slot]] and r = [[slot]]. [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 8 9

Variables:
- t1 = 2  rule: `range(-20,20,1)`
- ANS = 5/2  rule: `fracs(t1*q,q-p)`
- DIS1 = 5/3  rule: `fracs(t1*q,q+p)`
- DIS2 = -1/2  rule: `fracs(t1*p,p-q)`
- DIS3 = 1/3  rule: `fracs(t1*p,p+q)`
- p = 1  rule: `rand(8)`
- q = 5  rule: `rand(9)`
- r = 1/5  rule: `fracs(p,q)`

Inline slots:
- #1 variable-ref ref=t1 value=2 offset=123185
  context: Determine the sum of the infinite geometric series with t1 = [[slot]] and r = [[slot]].
- #2 variable-ref ref=r value=1/5 offset=123205
  context: Determine the sum of the infinite geometric series with t1 = [[slot]] and r = [[slot]].
- #3 variable-ref ref=DIS3 value=1/3 offset=123215
  context: [[slot]]
- #4 variable-ref ref=DIS2 value=-1/2 offset=123223
  context: [[slot]]
- #5 variable-ref ref=DIS1 value=5/3 offset=123233
  context: [[slot]]
- #6 variable-ref ref=ANS value=5/2 offset=123241
  context: [[slot]]

## record-28 @ 125819

- Metadata: Difficult | Section 1.5 | RF 10 | Infinite Geometric Series | first term | infinite geometric series
- Counts: strings=103, variables=8, display=5, refs=19, slots=6, visibleChoices=4

```text
The sum of an infinite geometric series is [[slot]] and its common ratio is [[slot]]. What is the first term of the series? [[slot]] [[slot]] [[slot]] [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- t1 = 5  rule: `range(-50,50,1)`
- DIS1 = 80/3  rule: `fracs(t1*q^2,p*(q-p))`
- DIS2 = 5/3  rule: `fracs(t1*p,q-p)`
- Inf_Sum = 20/3  rule: `fracs(t1*q,q-p)`
- p = 2  rule: `rand(8)`
- q = 8  rule: `rand(9)`
- r = 1/4  rule: `fracs(p,q)`
- t1a = 5  rule: `str(t1)`

Inline slots:
- #1 variable-ref ref=p value=2 offset=127131
  context: The sum of an infinite geometric series is [[slot]] and its common ratio is [[slot]]. What is the first term of the series?
- #2 variable-ref ref=r value=1/4 offset=127183
  context: The sum of an infinite geometric series is [[slot]] and its common ratio is [[slot]]. What is the first term of the series?
- #3 variable-ref ref=p value=2 offset=127269
  context: [[slot]]
- #4 variable-ref ref=Inf_Sum value=20/3 offset=127277
  context: [[slot]]
- #5 variable-ref ref=r value=1/4 offset=127287
  context: [[slot]]
- #6 variable-ref ref=r value=1/4 offset=127295
  context: [[slot]]

## record-29 @ 129765

- Metadata: Average | Section 1.5 | RF 10 | Infinite Geometric Series | convergent series | infinite geometric series | sum
- Counts: strings=91, variables=7, display=5, refs=10, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which of the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]? The series is convergent and has a sum of [[slot]]. The series is divergent and has a sum of [[slot]]. The series is divergent and has no sum. The series is convergent and has no sum.
```

Choices:
- A. The series is convergent and has a sum of [[slot]].
- B. The series is divergent and has a sum of [[slot]].
- C. The series is divergent and has no sum.
- D. The series is convergent and has no sum.

Variables:
- t1 = –50  rule: `range(-50,50,1)`
- ANS = -500  rule: `fracs(t1*10,10-q)`
- t2 = -45  rule: `fracs(t1*q,10)`
- t3 = -81/2  rule: `fracs(t1*q^2,100)`
- q = 9  rule: `range(1,9,1)`
- t4 = -729/20  rule: `fracs(t1*q^3,1000)`
- r = 0.9  rule: `q/10`

Inline slots:
- #1 variable-ref ref=t1 value=–50 offset=130881
  context: Which of the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]?
- #2 variable-ref ref=t2 value=-45 offset=130891
  context: Which of the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]?
- #3 variable-ref ref=t3 value=-81/2 offset=130903
  context: Which of the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]?
- #4 variable-ref ref=t4 value=-729/20 offset=130915
  context: Which of the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]?
- #5 variable-ref ref=ANS value=-500 offset=130925
  context: the following best describes the series [[slot]] + ([[slot]]) + ([[slot]]) + ([[slot]]) + [[slot]]?
- #6 variable-ref ref=ANS value=-500 offset=131019
  context: The series is convergent and has a sum of [[slot]].
- #7 unknown-object ref=- value=- offset=131113
  context: The series is divergent and has a sum of [[slot]].

## record-30 @ 134048

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | general term | arithmetic sequence
- Counts: strings=44, variables=0, display=4, refs=5, slots=3, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
list("a", "n", "d") a, n, d s1<>s2 In the formula for the general term of an arithmetic sequence [[slot]], [[slot]] represents the ____________________ and [[slot]] represents the ____________________.
```

Choices:
- B. k

Inline slots:
- #1 math-object ref=- value=- offset=134962
  context: In the formula for the general term of an arithmetic sequence [[slot]], [[slot]] represents the ____________________ and [[slot]] represents the _______________
- #2 math-object ref=- value=- offset=134968
  context: In the formula for the general term of an arithmetic sequence [[slot]], [[slot]] represents the ____________________ and [[slot]] represents the ____________________.
- #3 unknown-object ref=- value=- offset=135052
  context: term of an arithmetic sequence [[slot]], [[slot]] represents the ____________________ and [[slot]] represents the ____________________.

## record-31 @ 137143

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | arithmetic series
- Counts: strings=95, variables=14, display=1, refs=14, slots=10, visibleChoices=0

```text
[[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.
```

Variables:
- a = 9  rule: `range(-50,50,1)`
- d = 8  rule: `range(-10,10,1)`
- t2 = 17  rule: `a+d`
- t3 = 25  rule: `a+2*d`
- t4 = 33  rule: `a+3*d`
- t5 = 41  rule: `a+4*d`
- t2sgn = +  rule: `sgns(t2)`
- t3sgn = +  rule: `sgns(t3)`
- t4sgn = +  rule: `sgns(t4)`
- t5sgn = +  rule: `sgns(t5)`
- dt2 = 17  rule: `abs(t2)`
- dt3 = 25  rule: `abs(t3)`
- dt4 = 33  rule: `abs(t4)`
- dt5 = 41  rule: `abs(t5)`

Inline slots:
- #1 variable-ref ref=t2sgn value=+ offset=138495
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an
- #2 variable-ref ref=dt2 value=17 offset=138499
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example o
- #3 variable-ref ref=t3sgn value=+ offset=138503
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) __
- #4 variable-ref ref=dt3 value=25 offset=138507
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ___________
- #5 variable-ref ref=t4sgn value=+ offset=138511
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________
- #6 variable-ref ref=dt4 value=33 offset=138515
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.
- #7 variable-ref ref=t5sgn value=+ offset=138519
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.
- #8 variable-ref ref=dt5 value=41 offset=138523
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.
- #9 variable-ref ref=d value=8 offset=138527
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.
- #10 variable-ref ref=d value=8 offset=138535
  context: [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is an example of a(n) ____________________.

## record-32 @ 141796

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | number of terms | geometric sequence
- Counts: strings=52, variables=7, display=2, refs=6, slots=5, visibleChoices=0

```text
The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],, [[slot]] has ____________________ terms.
```

Variables:
- n = 10  rule: `range(6,12,1)`
- t1 = 20  rule: `range(-20,20,1)`
- r = 3  rule: `range(-3,3,1)`
- t2 = 60  rule: `t1*r`
- t3 = 180  rule: `t1*pow(r,2)`
- t4 = 540  rule: `t1*pow(r,3)`
- tn = 393 660  rule: `t1*pow(r,(n-1))`

Inline slots:
- #1 variable-ref ref=t1 value=20 offset=142684
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #2 variable-ref ref=t2 value=60 offset=142690
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #3 variable-ref ref=t3 value=180 offset=142696
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #4 variable-ref ref=t4 value=540 offset=142702
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #5 variable-ref ref=tn value=393 660 offset=142714
  context: , [[slot]] has ____________________ terms.

## record-33 @ 144930

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | number of terms | geometric sequence
- Counts: strings=55, variables=7, display=2, refs=8, slots=5, visibleChoices=0

```text
The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],, [[slot]] has ____________________ terms.
```

Variables:
- n = 10  rule: `range(8,15,1)`
- t1 = 5  rule: `range(-20,20,1)`
- r = 5  rule: `range(-5,5,1)`
- t2 = 25  rule: `t1*r`
- t3 = 125  rule: `t1*pow(r,2)`
- t4 = 625  rule: `t1*pow(r,3)`
- tn = 9 765 625  rule: `t1*pow(r,(n-1))`

Inline slots:
- #1 variable-ref ref=t1 value=5 offset=145820
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #2 variable-ref ref=t2 value=25 offset=145826
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #3 variable-ref ref=t3 value=125 offset=145832
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #4 variable-ref ref=t4 value=625 offset=145838
  context: The geometric sequence [[slot]], [[slot]], [[slot]], [[slot]],
- #5 variable-ref ref=tn value=9 765 625 offset=145850
  context: , [[slot]] has ____________________ terms.

## record-34 @ 148078

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=95, variables=13, display=1, refs=19, slots=10, visibleChoices=0

```text
The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
```

Variables:
- n = 8  rule: `range(6,12,1)`
- t1 = 5  rule: `range(-10,10,1)`
- r = –3  rule: `range(-3,3,1)`
- t2 = –15  rule: `t1*r`
- t3 = 45  rule: `t1*pow(r,2)`
- t4 = –135  rule: `t1*pow(r,3)`
- Sn = –8200  rule: `t1*(r^n-1)/(r-1)`
- first = –  rule: `sgns(t2)`
- second = +  rule: `sgns(t3)`
- third = –  rule: `sgns(t4)`
- t2used = 15  rule: `abs(t2)`
- t3used = 45  rule: `abs(t3)`
- t4used = 135  rule: `abs(t4)`

Inline slots:
- #1 variable-ref ref=n value=8 offset=149444
  context: The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slo
- #2 variable-ref ref=t1 value=5 offset=149508
  context: The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ______________
- #3 variable-ref ref=first value=– offset=149512
  context: The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #4 variable-ref ref=t2used value=15 offset=149516
  context: The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #5 variable-ref ref=second value=+ offset=149520
  context: The sum of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #6 variable-ref ref=t3used value=45 offset=149524
  context: m of the first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #7 variable-ref ref=third value=– offset=149528
  context: first [[slot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #8 variable-ref ref=t4used value=135 offset=149532
  context: lot]] terms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #9 variable-ref ref=second value=+ offset=149536
  context: ms of the geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.
- #10 variable-ref ref=Sn value=–8200 offset=149540
  context: geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] is ____________________.

## record-35 @ 152583

- Metadata: Easy | Section 1.5 | RF 10 | Infinite Geometric Series | ratio
- Counts: strings=80, variables=12, display=1, refs=10, slots=8, visibleChoices=0

```text
The ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
```

Variables:
- ratio = [[slot]]  rule: `β`
- r = –0.2  rule: `range(-1,1,0.1)`
- t1 = –2.5  rule: `range(-5,5,0.5)`
- t2 = 0.5  rule: `t1*r`
- t3 = –0.1  rule: `t1*pow(r,2)`
- t4 = 0.02  rule: `t1*pow(r,3)`
- sgn2 = +  rule: `sgns(t2)`
- sgn3 = –  rule: `sgns(t3)`
- sgn4 = +  rule: `sgns(t4)`
- t2d = 0.5  rule: `abs(t2)`
- t3d = 0.1  rule: `abs(t3)`
- t4d = 0.02  rule: `abs(t4)`

Inline slots:
- #1 variable-ref ref=t1 value=–2.5 offset=153813
  context: The ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #2 variable-ref ref=sgn2 value=+ offset=153817
  context: The ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #3 variable-ref ref=t2d value=0.5 offset=153821
  context: The ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #4 variable-ref ref=sgn3 value=– offset=153825
  context: The ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #5 variable-ref ref=t3d value=0.1 offset=153829
  context: ratio used to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #6 variable-ref ref=sgn4 value=+ offset=153833
  context: ed to generate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #7 variable-ref ref=t4d value=0.02 offset=153837
  context: erate the infinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.
- #8 variable-ref ref=r value=–0.2 offset=153845
  context: nfinite geometric series [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] [[slot]] + [[slot]] is ____________________.

## record-36 @ 156560

- Metadata: Easy | Section 1.5 | RF 10 | Infinite Geometric Series | infinite geometric series
- Counts: strings=13, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
a geometric series that has no last term
```

## record-37 @ 157674

- Metadata: Easy | Section 1.4 | RF 10 | Geometric Series | geometric series
- Counts: strings=13, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
the sum of the terms of a sequence in which the terms have a common ratio
```

## record-38 @ 158818

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | arithmetic series
- Counts: strings=12, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
the sum of the terms of a sequence in which the terms have a common difference
```

## record-39 @ 159974

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | arithmetic sequence
- Counts: strings=12, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
a sequence where there is a common difference between consecutive terms
```

## record-40 @ 161126

- Metadata: Easy | Section 1.3 | RF 10 | Geometric Sequences | geometric sequence
- Counts: strings=12, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
a sequence where there is a common ratio between consecutive terms
```

## record-41 @ 162266

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | terms | explicit formula | arithmetic sequence
- Counts: strings=60, variables=0, display=5, refs=5, slots=1, visibleChoices=5
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The first three terms of the sequence defined by [[slot]] are 0.5, 0.8, 1.1 0.2, –0.1, –0.4 –0.3, 0.2, 0.7 –0.3, –0.8, –1.3
```

Choices:
- A. 0.5, 0.8, 1.1
- B. –0.3, 0.2, 0.7
- C. 0.2, –0.1, –0.4
- D. –0.3, –0.8, –1.3 7 9
- G. \

Inline slots:
- #1 unknown-object ref=- value=- offset=162608
  context: The first three terms of the sequence defined by [[slot]] are

## record-42 @ 164475

- Metadata: Easy | Section 1.1 | RF 9 | Arithmetic Sequences | terms | explicit formula | arithmetic sequence
- Counts: strings=43, variables=0, display=1, refs=11, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
a) t1 = –8, d = 3b) [[slot]]c) [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=165137
  context: a) t1 = –8, d = 3 b) [[slot]] c) [[slot]]
- #2 unknown-object ref=- value=- offset=165147
  context: a) t1 = –8, d = 3 b) [[slot]] c) [[slot]]

## record-43 @ 167522

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | terms | explicit formula | arithmetic sequence
- Counts: strings=23, variables=0, display=2, refs=4, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
3a, 3a – 2b, 3a – 4b, 3a – 6b, [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=168138
  context: [[slot]]

## record-44 @ 170137

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | terms | explicit formula | arithmetic sequence
- Counts: strings=74, variables=0, display=1, refs=16, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]], 1, [[slot]], [[slot]],
```

Inline slots:
- #1 unknown-object ref=- value=- offset=170387
  context: [[slot]], 1, [[slot]], [[slot]],
- #2 unknown-object ref=- value=- offset=170399
  context: [[slot]], 1, [[slot]], [[slot]],
- #3 unknown-object ref=- value=- offset=170405
  context: [[slot]], 1, [[slot]], [[slot]],

## record-45 @ 174514

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | explicit formula | terms
- Counts: strings=62, variables=0, display=1, refs=17, slots=0, visibleChoices=0

```text
The starting wage at a bookstore is $8.50 per hour with a yearly increase of $0.75 per hour.a) Write the general term of the sequence representing the hourly rate earned in each year.b) Use your expression from part a) to determine the hourly rate after 6 years.c) How many years will someone need to work at the store to earn $15.25 per hour?
```

## record-46 @ 178715

- Metadata: Average | Section 1.1 | Section 1.3 | RF 9 | Arithmetic Sequences | Geometric Sequences | type of sequence
- Counts: strings=13, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
Since the terms have a common ratio of –2, this sequence is geometric.
```

## record-47 @ 180317

- Metadata: Average | Section 1.1 | Section 1.3 | RF 9 | Arithmetic Sequences | Geometric Sequences | type of sequence
- Counts: strings=35, variables=1, display=1, refs=0, slots=0, visibleChoices=0

```text
Since the sequence has neither a common difference nor a common ratio, it is neither geometric nor arithmetic.
```

Variables:
- d = P  rule: `[[slot]]`

## record-48 @ 182826

- Metadata: Average | Section 1.1 | Section 1.3 | RF 9 | Arithmetic Sequences | Geometric Sequences | type of sequence
- Counts: strings=13, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
Since the terms have a common ratio of 10, this sequence is geometric.
```

## record-49 @ 184446

- Metadata: Average | Section 1.1 | Section 1.3 | RF 9 | Arithmetic Sequences | Geometric Sequences | type of sequence
- Counts: strings=39, variables=1, display=1, refs=2, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
Since the terms have a common difference of [[slot]], this sequence is arithmetic.
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 unknown-object ref=- value=- offset=185920
  context: Since the terms have a common difference of [[slot]], this sequence is arithmetic.

## record-50 @ 187041

- Metadata: Easy | Section 1.3 | RF 9 | Geometric Sequences | explicit formula | terms | geometric sequence
- Counts: strings=22, variables=0, display=1, refs=1, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]] = 3, r = 2
```

Inline slots:
- #1 unknown-object ref=- value=- offset=187281
  context: [[slot]] = 3, r = 2

## record-51 @ 189407

- Metadata: Average | Section 1.3 | RF 9 | Geometric Sequences | explicit formula | terms | geometric sequence
- Counts: strings=76, variables=1, display=1, refs=13, slots=3, visibleChoices=0

```text
a) Since t1 = 3 and r = [[slot]],[[slot]]b) [[slot]]
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=d value=P offset=190855
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]
- #2 variable-ref ref=d value=P offset=190861
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]
- #3 variable-ref ref=d value=P offset=190871
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]

## record-52 @ 193649

- Metadata: Average | Section 1.3 | RF 9 | Geometric Sequences | explicit formula | terms | geometric sequence
- Counts: strings=80, variables=1, display=1, refs=16, slots=3, visibleChoices=0

```text
a) Since t1 = 3 and r = [[slot]],[[slot]]b) [[slot]]
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=d value=P offset=195006
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]
- #2 variable-ref ref=d value=P offset=195012
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]
- #3 variable-ref ref=d value=P offset=195022
  context: a) Since t1 = 3 and r = [[slot]], [[slot]] b) [[slot]]

## record-53 @ 197851

- Metadata: Average | Section 1.3 | RF 9 | Geometric Sequences | explicit formula | terms | geometric sequence
- Counts: strings=90, variables=0, display=1, refs=23, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]] [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=198097
  context: [[slot]] [[slot]]
- #2 unknown-object ref=- value=- offset=198101
  context: [[slot]] [[slot]]

## record-54 @ 202576

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | explicit formula | sum | terms | arithmetic series
- Counts: strings=87, variables=0, display=2, refs=25, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]] = 2, d = 3, n = 4 [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=202822
  context: [[slot]] = 2, d = 3, n = 4
- #2 unknown-object ref=- value=- offset=203102
  context: [[slot]]

## record-55 @ 207055

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | explicit formula | sum | terms | arithmetic series
- Counts: strings=97, variables=0, display=1, refs=30, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
2 + 4 + 6 + [[slot]] + 48
```

Inline slots:
- #1 unknown-object ref=- value=- offset=207331
  context: 2 + 4 + 6 + [[slot]] + 48

## record-56 @ 211747

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | explicit formula | sum | terms | arithmetic series
- Counts: strings=93, variables=0, display=1, refs=25, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
–12 – 9 – 6 – [[slot]] + 12
```

Inline slots:
- #1 unknown-object ref=- value=- offset=212027
  context: –12 – 9 – 6 – [[slot]] + 12

## record-57 @ 216408

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=48, variables=0, display=1, refs=8, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=216600
  context: [[slot]]

## record-58 @ 219259

- Metadata: Average | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=74, variables=1, display=1, refs=16, slots=3, visibleChoices=0

```text
[[slot]] = 4k, d = 7k[[slot]][[slot]]
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=d value=P offset=220341
  context: [[slot]] = 4k, d = 7k [[slot]] [[slot]]
- #2 variable-ref ref=d value=P offset=220371
  context: [[slot]] = 4k, d = 7k [[slot]] [[slot]]
- #3 variable-ref ref=d value=P offset=220375
  context: [[slot]] = 4k, d = 7k [[slot]] [[slot]]

## record-59 @ 223077

- Metadata: Difficult | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=89, variables=1, display=2, refs=24, slots=4, visibleChoices=0

```text
t1 = 4a – 3b, d = 4b[[slot]][[slot]][[slot]] [[slot]]
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=d value=P offset=224354
  context: t1 = 4a – 3b, d = 4b [[slot]] [[slot]] [[slot]]
- #2 variable-ref ref=d value=P offset=224358
  context: t1 = 4a – 3b, d = 4b [[slot]] [[slot]] [[slot]]
- #3 variable-ref ref=d value=P offset=224362
  context: t1 = 4a – 3b, d = 4b [[slot]] [[slot]] [[slot]]
- #4 variable-ref ref=d value=P offset=224642
  context: [[slot]]

## record-60 @ 227499

- Metadata: Average | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=42, variables=0, display=1, refs=6, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Find the value of [[slot]] given [[slot]] and [[slot]]. Be sure to show all of your work.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=227731
  context: Find the value of [[slot]] given [[slot]] and [[slot]]. Be sure to show all of your work.
- #2 unknown-object ref=- value=- offset=227747
  context: Find the value of [[slot]] given [[slot]] and [[slot]]. Be sure to show all of your work.
- #3 unknown-object ref=- value=- offset=227759
  context: Find the value of [[slot]] given [[slot]] and [[slot]]. Be sure to show all of your work.

## record-61 @ 230472

- Metadata: Difficult | Section 1.4 | RF 10 | Geometric Series | sum | geometric series
- Counts: strings=85, variables=0, display=1, refs=13, slots=0, visibleChoices=0

```text
If S1 = 0.7 and S2 = 2.1 in a geometric series, determine the sum of the first 12 terms in the series. Be sure to show all of your work.
```

## record-62 @ 235106

- Metadata: Difficult | Section 1.5 | RF 10 | Infinite Geometric Series | sum | infinite geometric series
- Counts: strings=161, variables=0, display=1, refs=36, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A bouncy ball bounces to [[slot]] its height when it is dropped on a hard surface. Suppose the ball is dropped from 20 m.a) What height will the ball bounce back up to after the sixth bounce?b) What is the total distance the ball travels if it bounces indefinitely?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=235392
  context: A bouncy ball bounces to [[slot]] its height when it is dropped on a hard surface. Suppose the ball is dropped from 20 m. a

## record-63 @ 335915

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | explicit formula | arithmetic sequence | terms
- Counts: strings=338, variables=0, display=1, refs=68, slots=4, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Consider an arithmetic sequence with [[slot]] and [[slot]].a) Determine the values of t1 and d.b) Determine an explicit formula for the general term of the sequence.c) Determine the value of each term.i) t12ii) t20iii) t26d) Determine the term number of each term.i) [[slot]]ii) 9iii) [[slot]]
```

Inline slots:
- #1 math-object ref=- value=- offset=336239
  context: Consider an arithmetic sequence with [[slot]] and [[slot]]. a) Determine the values of t1 and d. b) Determine an explicit formula for t
- #2 math-object ref=- value=- offset=336251
  context: Consider an arithmetic sequence with [[slot]] and [[slot]]. a) Determine the values of t1 and d. b) Determine an explicit formula for the general te
- #3 unknown-object ref=- value=- offset=336687
  context: value of each term. i) t12 ii) t20 iii) t26 d) Determine the term number of each term. i) [[slot]] ii) 9 iii) [[slot]]
- #4 unknown-object ref=- value=- offset=336713
  context: i) t12 ii) t20 iii) t26 d) Determine the term number of each term. i) [[slot]] ii) 9 iii) [[slot]]

## record-64 @ 350036

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | arithmetic sequence | explicit formula | terms
- Counts: strings=76, variables=0, display=1, refs=20, slots=0, visibleChoices=0

```text
In a lottery to join a golf club, the first person drawn from the names must pay $14 000. Each subsequent person drawn pays $250 less than the person before. The last person drawn pays $8000 for a membership.a) Write the first four terms of the sequence that represents the cost of a membership.b) Determine t1 and d for the sequence.c) Determine an explicit formula for the general term.d) What will the 10th golfer pay for a membership?e) How many golfers will be able to join the club?
```

## record-65 @ 355459

- Metadata: Average | Section 1.1 | RF 9 | Arithmetic Sequences | arithmetic sequence | explicit formula | terms
- Counts: strings=44, variables=0, display=1, refs=6, slots=0, visibleChoices=0

```text
At the end of the second week after opening, a new fitness club has 870 members. At the end of the seventh week, there are 1110 members. Suppose the increase is arithmetic.a) How many members joined the club each week?b) How many members were there in the first week?
```

## record-66 @ 358850

- Metadata: Difficult | Section 1.2 | RF 9 | Arithmetic Series | arithmetic series | explicit formula | terms
- Counts: strings=55, variables=0, display=1, refs=8, slots=0, visibleChoices=0

```text
The sum of the first two terms of an arithmetic series is 15 and the sum of the next two terms is 43. What are the first four terms of the series?
```

## record-67 @ 363269

- Metadata: Difficult | Section 1.2 | RF 9 | Arithmetic Series | arithmetic sequence | terms | sum | arithmetic series
- Counts: strings=443, variables=4, display=1, refs=98, slots=1, visibleChoices=0

```text
In an arithmetic series, the sum of the first 5 terms is 70 and the sum of the first 11 terms is 352.a) Determine the values of [[slot]] and d.b) What is the sum of the first i) 30 terms?ii) 50 terms?iii) 100 terms?c) Describe how you could use the formula for the sum of an arithmetic series to find the total of terms 35 to 40.d) Use your method from part c) to determine the sum of terms 35 to 40.
```

Variables:
- v = ?  rule: `&`
- w = [  rule: `[`
- n = 1  rule: `2`
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=n value=1 offset=370363
  context: first 5 terms is 70 and the sum of the first 11 terms is 352. a) Determine the values of [[slot]] and d. b) What is the sum of the first i) 30 terms? ii) 50 terms? iii) 100 terms? c) Des

## record-68 @ 390576

- Metadata: Easy | Section 1.2 | RF 9 | Arithmetic Series | sum | arithmetic series
- Counts: strings=460, variables=0, display=1, refs=106, slots=0, visibleChoices=0

```text
A toy car is rolling down an inclined track and picking up speed as it goes. The car travels 4 cm in the first second, 8 cm in the second second, 12 cm in the next second, and so on. What is the total distance travelled by the car in the first 30 s?
```

## record-69 @ 426303

- Metadata: Average | Section 1.3 | RF 9 | Geometric Sequences | explicit formula | geometric sequence | terms
- Counts: strings=136, variables=0, display=1, refs=43, slots=0, visibleChoices=0

```text
The value of an antique increases in value at a rate of 2.5% every year. In 2000, the antique was purchased for $5000.a) Determine an explicit formula to represent the value of the antique since the year 2000.b) Use your formula to write the first three terms of the sequence.c) What was the value of the antique in 2008?d) In which year will the value of the antique be $11 866?
```

## record-70 @ 434294

- Metadata: Average | Section 1.3 | RF 10 | Geometric Sequences | explicit formula | terms | geometric sequence
- Counts: strings=157, variables=0, display=2, refs=48, slots=0, visibleChoices=0

```text
A Registered Education Savings Plan (RESP) earns interest at a rate of 5% per year, compounded annually. Jasmine s parents invest $4000 in the account today.a) Determine an explicit formula to represent the value of the investment.b) Use your formula to write the first four terms of the sequence.c) What will the investment be worth ini) 9 years?ii) 16 years?d) Approximately how long will it take for the investment to double?
```

## record-71 @ 442859

- Metadata: Average | Section 1.3 | Section 1.4 | RF 10 | Geometric Sequences | Geometric Series | geometric sequence | explicit formula | sum | geometric series
- Counts: strings=71, variables=0, display=1, refs=18, slots=0, visibleChoices=0

```text
The first prize in a lottery is $250 000. Each winner chosen after the first is paid 20% as much as the winner before them. a) Determine t1 and r for the geometric sequence that represents this situation.b) Determine an explicit formula for the general term.c) Determine a formula for the sum of n terms of the geometric sequence.d) If 5 winning numbers are chosen,i) how much will the last person chosen be paid?ii) how much will have been paid out in the lottery?
```

## record-72 @ 448325

- Metadata: Difficult | Section 1.3 | Section 1.4 | RF 10 | Geometric Sequences | Geometric Series | geometric sequence | explicit formula | sum | geometric series
- Counts: strings=76, variables=0, display=1, refs=15, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A ball is kicked 26 m into the air. The ball falls, rebounds to half of its original height, and then falls to the ground again. This pattern of rebounding to half of the height from the previous bounce continues. a) Use this information to determine [[slot]] and r for the geometric sequence that represents this situation.b) Write an explicit formula for the general term.c) Write a formula for the total distance travelled after n bounces.d) If 7 bounces occur,i) how high will the seventh bounce be?ii) what total distance will the ball have travelled?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=449181
  context: f of the height from the previous bounce continues. a) Use this information to determine [[slot]] and r for the geometric sequence that represents this situation. b) Write an explicit for

## record-73 @ 454729

- Metadata: Difficult | Section 1.4 | RF 10 | Geometric Series | explicit formula | sum | geometric series
- Counts: strings=65, variables=0, display=1, refs=17, slots=0, visibleChoices=0

```text
In a lottery, the first ticket drawn wins a prize of $25. Each ticket after that receives a prize that is twice the value of the preceding prize.a) Write a function to model the total amount of prize money given away.b) How many prizes are given out if the total amount of prize money is approximately $2 million?
```

## record-74 @ 458949

- Metadata: Difficult | Section 1.4 | RF 10 | Geometric Series | explicit formula | sum | geometric series
- Counts: strings=387, variables=0, display=1, refs=56, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
For a geometric series, [[slot]]. What are the first three terms of the series if the first term is 3?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=459237
  context: For a geometric series, [[slot]]. What are the first three terms of the series if the first term is 3?

## record-75 @ 504806

- Metadata: Average | Section 1.5 | RF 10 | Infinite Geometric Series | explicit formula | sum | infinite geometric series
- Counts: strings=110, variables=0, display=1, refs=10, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
The first perimeter, [[slot]], is 30 cm.The common ratio, r, is [[slot]].Use the formula for the sum of an infinite geometric series.[[slot]]The total perimeter is 60 cm.
```

Inline slots:
- #1 math-object ref=- value=- offset=524712
  context: The first perimeter, [[slot]], is 30 cm. The common ratio, r, is [[slot]]. Use the formula for the sum of an infinite g
- #2 math-object ref=- value=- offset=524786
  context: The first perimeter, [[slot]], is 30 cm. The common ratio, r, is [[slot]]. Use the formula for the sum of an infinite geometric series. [[slot]] The total perimete
- #3 math-object ref=- value=- offset=524914
  context: ommon ratio, r, is [[slot]]. Use the formula for the sum of an infinite geometric series. [[slot]] The total perimeter is 60 cm.

## record-76 @ 527161

- Metadata: Difficult | Section 1.5 | RF 10 | Infinite Geometric Series | explicit formula | sum | infinite geometric series
- Counts: strings=231, variables=0, display=1, refs=49, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Write each repeating decimal number as an equivalent fraction in lowest terms.a) 0.5555...b) [[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=527625
  context: each repeating decimal number as an equivalent fraction in lowest terms. a) 0.5555... b) [[slot]]

