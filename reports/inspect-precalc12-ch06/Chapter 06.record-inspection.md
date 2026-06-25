# Record Inspection: Chapter 06.bnk

- Source: `ignore/ExamView/Banks/Pre-Calculus 12/Chapter 06.bnk`
- Inflated bytes: 413692
- Records: 65
- Inline slots: 234
- Slot classes: variable-ref=76, unknown-object=125, math-object=32, fixed-value=1

## record-1 @ 4628

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | reciprocal identity
- Counts: strings=146, variables=6, display=9, refs=32, slots=4, visibleChoices=4

```text
Which equation is a reciprocal identity? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 1  rule: `rand(3)`
- fn1 = sec  rule: `choose(num,"sec","csc","cot")`
- fn2 = cos  rule: `choose(num,"cos","sin","tan")`
- dis1 = sin  rule: `choose(num,"sin","tan","cos")`
- dis2 = tan  rule: `choose(num,"tan","cos","sin")`
- dis3 = csc  rule: `choose(num,"csc","cot","sec")`

Inline slots:
- #1 variable-ref ref=fn1 value=sec offset=5686
  context: [[slot]]
- #2 variable-ref ref=dis2 value=tan offset=5696
  context: [[slot]]
- #3 variable-ref ref=fn1 value=sec offset=5708
  context: [[slot]]
- #4 variable-ref ref=dis3 value=csc offset=5718
  context: [[slot]]

## record-2 @ 9830

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | quotient identity
- Counts: strings=149, variables=6, display=9, refs=36, slots=4, visibleChoices=4

```text
Which equation is a quotient identity? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 2  rule: `rand(2)`
- fn1 = cot  rule: `choose(num,"tan","cot")`
- fn2 = cos  rule: `if(num=1,"sin","cos")`
- fn3 = sin  rule: `if(num=1,"cos","sin")`
- dis1 = sin  rule: `if(num=1,"cos","sin")`
- dis2 = cos  rule: `if(num=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=fn1 value=cot offset=10802
  context: [[slot]]
- #2 variable-ref ref=dis2 value=cos offset=10812
  context: [[slot]]
- #3 variable-ref ref=fn1 value=cot offset=10824
  context: [[slot]]
- #4 variable-ref ref=fn2 value=cos offset=10834
  context: [[slot]]

## record-3 @ 14988

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Pythagorean identities
- Counts: strings=267, variables=4, display=9, refs=68, slots=12, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
Which equation is a Pythagorean identity? A. [[slot]][[slot]][[slot]] C. [[slot]][[slot]][[slot]] B. [[slot]][[slot]][[slot]] D. [[slot]][[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]]
- B. [[slot]][[slot]][[slot]]
- C. [[slot]][[slot]][[slot]]
- D. [[slot]][[slot]][[slot]]

Variables:
- num = 2  rule: `rand(3)`
- eq1 = 0  rule: `if(num=1,true,false)`
- eq2 = 1  rule: `if(num=2,true,false)`
- eq3 = 0  rule: `if(num=3,true,false)`

Inline slots:
- #1 variable-ref ref=eq2 value=1 offset=15750
  context: [[slot]][[slot]][[slot]]
- #2 variable-ref ref=eq3 value=0 offset=15752
  context: [[slot]][[slot]][[slot]]
- #3 variable-ref ref=eq2 value=1 offset=15754
  context: [[slot]][[slot]][[slot]]
- #4 variable-ref ref=eq3 value=0 offset=15764
  context: [[slot]][[slot]][[slot]]
- #5 variable-ref ref=eq1 value=0 offset=15766
  context: [[slot]][[slot]][[slot]]
- #6 variable-ref ref=eq2 value=1 offset=15768
  context: [[slot]][[slot]][[slot]]
- #7 variable-ref ref=eq3 value=0 offset=15780
  context: [[slot]][[slot]][[slot]]
- #8 variable-ref ref=eq1 value=0 offset=15782
  context: [[slot]][[slot]][[slot]]
- #9 unknown-object ref=- value=- offset=15784
  context: [[slot]][[slot]][[slot]]
- #10 unknown-object ref=- value=- offset=15794
  context: [[slot]][[slot]][[slot]]
- #11 unknown-object ref=- value=- offset=15796
  context: [[slot]][[slot]][[slot]]
- #12 unknown-object ref=- value=- offset=15798
  context: [[slot]][[slot]][[slot]]

## record-4 @ 24864

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | quotient identity | reciprocal identity
- Counts: strings=571, variables=16, display=9, refs=170, slots=26, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to? A. [[slot]][[slot]][[slot]][[slot]][[slot]] C. [[slot]][[slot]][[slot]][[slot]][[slot]] B. [[slot]][[slot]][[slot]][[slot]][[slot]] D. [[slot]][[slot]][[slot]][[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]][[slot]][[slot]]
- B. [[slot]][[slot]][[slot]][[slot]][[slot]]
- C. [[slot]][[slot]][[slot]][[slot]][[slot]]
- D. [[slot]][[slot]][[slot]][[slot]][[slot]]

Variables:
- num1 = 1  rule: `if(rand(2)=1,true,false)`
- num2 = 1  rule: `if(rand(2)=1,true,false)`
- num3 = 0  rule: `if(rand(2)=1,true,false)`
- num1a = 0  rule: `if(num1=true,false,true)`
- num2a = 0  rule: `if(num2=true,false,true)`
- num3a = 1  rule: `if(num3=true,false,true)`
- ans1 = 0  rule: `if((num1=true and num2=true and num3=true) or (num1=false and num2=false and num3=false),true,false)`
- ans2 = 1  rule: `if((num1=true and num2=true and num3=false) or (num1=true and num2=false and num3=true),true,false)`
- ans3 = 0  rule: `if((num1=true and num2=false and num3=false),true,false)`
- ans4 = 0  rule: `if((num1=false and num2=true and num3=true),true,false)`
- ans5 = 0  rule: `if((num1=false and num2=true and num3=false) or (num1=false and num2=false and num3=true),true,false)`
- dis1 = 0  rule: `if(ans1=true,true,false)`
- dis2 = 0  rule: `if(ans1=true,true,false)`
- dis3 = 0  rule: `if(ans1=true,true,false)`
- dis4 = 0  rule: `if(ans1=true,true,false)`
- dis5 = 0  rule: `if(ans1=true,true,false)`

Inline slots:
- #1 math-object ref=- value=- offset=27526
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #2 math-object ref=- value=- offset=27528
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #3 math-object ref=- value=- offset=27530
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #4 math-object ref=- value=- offset=27532
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #5 math-object ref=- value=- offset=27534
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #6 math-object ref=- value=- offset=27536
  context: What does the expression [[slot]][[slot]][[slot]][[slot]][[slot]][[slot]] simplify to?
- #7 unknown-object ref=- value=- offset=27574
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #8 unknown-object ref=- value=- offset=27576
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #9 unknown-object ref=- value=- offset=27578
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #10 unknown-object ref=- value=- offset=27580
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #11 unknown-object ref=- value=- offset=27582
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #12 unknown-object ref=- value=- offset=27592
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #13 unknown-object ref=- value=- offset=27594
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #14 unknown-object ref=- value=- offset=27596
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #15 unknown-object ref=- value=- offset=27598
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #16 unknown-object ref=- value=- offset=27600
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #17 unknown-object ref=- value=- offset=27612
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #18 unknown-object ref=- value=- offset=27614
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #19 unknown-object ref=- value=- offset=27616
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #20 unknown-object ref=- value=- offset=27618
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #21 unknown-object ref=- value=- offset=27620
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #22 unknown-object ref=- value=- offset=27630
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #23 unknown-object ref=- value=- offset=27632
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #24 unknown-object ref=- value=- offset=27634
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #25 unknown-object ref=- value=- offset=27636
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]
- #26 unknown-object ref=- value=- offset=27638
  context: [[slot]][[slot]][[slot]][[slot]][[slot]]

## record-5 @ 42868

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | reciprocal trigonometric ratios
- Counts: strings=254, variables=0, display=9, refs=89, slots=12, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which of the following sets is the set of reciprocal trigonometric ratios? A. csc [[slot]], sec [[slot]], and cot [[slot]] C. sin [[slot]], csc [[slot]], and cot [[slot]] B. sec [[slot]], cos [[slot]], and cot [[slot]] D. csc [[slot]], sec [[slot]], and tan [[slot]]
```

Choices:
- A. csc [[slot]], sec [[slot]], and cot [[slot]]
- B. sec [[slot]], cos [[slot]], and cot [[slot]]
- C. sin [[slot]], csc [[slot]], and cot [[slot]]
- D. csc [[slot]], sec [[slot]], and tan [[slot]]

Inline slots:
- #1 unknown-object ref=- value=- offset=43376
  context: csc [[slot]], sec [[slot]], and cot [[slot]]
- #2 unknown-object ref=- value=- offset=43390
  context: csc [[slot]], sec [[slot]], and cot [[slot]]
- #3 unknown-object ref=- value=- offset=43412
  context: csc [[slot]], sec [[slot]], and cot [[slot]]
- #4 unknown-object ref=- value=- offset=43430
  context: sin [[slot]], csc [[slot]], and cot [[slot]]
- #5 unknown-object ref=- value=- offset=43444
  context: sin [[slot]], csc [[slot]], and cot [[slot]]
- #6 unknown-object ref=- value=- offset=43466
  context: sin [[slot]], csc [[slot]], and cot [[slot]]
- #7 unknown-object ref=- value=- offset=43486
  context: sec [[slot]], cos [[slot]], and cot [[slot]]
- #8 unknown-object ref=- value=- offset=43500
  context: sec [[slot]], cos [[slot]], and cot [[slot]]
- #9 unknown-object ref=- value=- offset=43522
  context: sec [[slot]], cos [[slot]], and cot [[slot]]
- #10 unknown-object ref=- value=- offset=43540
  context: csc [[slot]], sec [[slot]], and tan [[slot]]
- #11 unknown-object ref=- value=- offset=43554
  context: csc [[slot]], sec [[slot]], and tan [[slot]]
- #12 unknown-object ref=- value=- offset=43576
  context: csc [[slot]], sec [[slot]], and tan [[slot]]

## record-6 @ 51074

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | reciprocal trigonometric ratios
- Counts: strings=329, variables=7, display=9, refs=92, slots=15, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is an equivalent expression for [[slot]][[slot]][[slot]]? A. [[slot]][[slot]][[slot]] C. [[slot]][[slot]][[slot]] B. [[slot]][[slot]][[slot]] D. [[slot]][[slot]][[slot]]
```

Choices:
- A. [[slot]][[slot]][[slot]]
- B. [[slot]][[slot]][[slot]]
- C. [[slot]][[slot]][[slot]]
- D. [[slot]][[slot]][[slot]]

Variables:
- num = 3  rule: `rand(3)`
- num1 = 0  rule: `if(num=1,true,false)`
- num2 = 0  rule: `if(num=2,true,false)`
- num3 = 1  rule: `if(num=3,true,false)`
- ans1 = 0  rule: `if(num1=true,true,false)`
- ans2 = 0  rule: `if(num2=true,true,false)`
- ans3 = 1  rule: `if(num3=true,true,false)`

Inline slots:
- #1 variable-ref ref=ans2 value=0 offset=52154
  context: What is an equivalent expression for [[slot]][[slot]][[slot]]?
- #2 variable-ref ref=ans3 value=1 offset=52156
  context: What is an equivalent expression for [[slot]][[slot]][[slot]]?
- #3 variable-ref ref=ans1 value=0 offset=52158
  context: What is an equivalent expression for [[slot]][[slot]][[slot]]?
- #4 variable-ref ref=ans3 value=1 offset=52170
  context: [[slot]][[slot]][[slot]]
- #5 variable-ref ref=ans1 value=0 offset=52172
  context: [[slot]][[slot]][[slot]]
- #6 variable-ref ref=ans2 value=0 offset=52174
  context: [[slot]][[slot]][[slot]]
- #7 variable-ref ref=ans1 value=0 offset=52184
  context: [[slot]][[slot]][[slot]]
- #8 variable-ref ref=ans2 value=0 offset=52186
  context: [[slot]][[slot]][[slot]]
- #9 variable-ref ref=ans3 value=1 offset=52188
  context: [[slot]][[slot]][[slot]]
- #10 variable-ref ref=ans1 value=0 offset=52200
  context: [[slot]][[slot]][[slot]]
- #11 variable-ref ref=ans2 value=0 offset=52202
  context: [[slot]][[slot]][[slot]]
- #12 variable-ref ref=ans3 value=1 offset=52204
  context: [[slot]][[slot]][[slot]]
- #13 unknown-object ref=- value=- offset=52214
  context: [[slot]][[slot]][[slot]]
- #14 unknown-object ref=- value=- offset=52216
  context: [[slot]][[slot]][[slot]]
- #15 unknown-object ref=- value=- offset=52218
  context: [[slot]][[slot]][[slot]]

## record-7 @ 62174

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=133, variables=0, display=9, refs=35, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=62568
  context: Which expression is equivalent to [[slot]]?
- #2 unknown-object ref=- value=- offset=62580
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=62590
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=62602
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=62612
  context: [[slot]]

## record-8 @ 67306

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=118, variables=0, display=8, refs=29, slots=4, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which expression is equivalent to [[slot]]? A. C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. 1
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=67700
  context: Which expression is equivalent to [[slot]]?
- #2 unknown-object ref=- value=- offset=67724
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=67736
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=67746
  context: [[slot]]

## record-9 @ 71535

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=142, variables=5, display=8, refs=35, slots=4, visibleChoices=4

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. 1
- D. [[slot]]

Variables:
- num = 2  rule: `rand(2)`
- fn1 = sec  rule: `if(num=1,"csc","sec")`
- fn2 = sin  rule: `if(num=1,"cos","sin")`
- ans = tan  rule: `if(num=1,"cot","tan")`
- dis_1 = cos  rule: `if(num=1,"sin","cos")`

Inline slots:
- #1 variable-ref ref=fn1 value=sec offset=72395
  context: Which expression is equivalent to [[slot]]?
- #2 variable-ref ref=fn2 value=sin offset=72407
  context: [[slot]]
- #3 variable-ref ref=ans value=tan offset=72429
  context: [[slot]]
- #4 variable-ref ref=dis_1 value=cos offset=72439
  context: [[slot]]

## record-10 @ 76221

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=156, variables=4, display=9, refs=40, slots=5, visibleChoices=4

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 1  rule: `rand(2)`
- fn1 = tan  rule: `if(num=1,"tan","cot")`
- fn2 = sin  rule: `if(num=1,"sin","cos")`
- dis1 = cos  rule: `if(num=1,"cos","sin")`

Inline slots:
- #1 variable-ref ref=fn1 value=tan offset=76985
  context: Which expression is equivalent to [[slot]]?
- #2 variable-ref ref=fn2 value=sin offset=76997
  context: [[slot]]
- #3 variable-ref ref=fn2 value=sin offset=77007
  context: [[slot]]
- #4 variable-ref ref=dis1 value=cos offset=77019
  context: [[slot]]
- #5 variable-ref ref=fn2 value=sin offset=77029
  context: [[slot]]

## record-11 @ 81723

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=119, variables=0, display=8, refs=28, slots=4, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. 1
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=82117
  context: Which expression is equivalent to [[slot]]?
- #2 unknown-object ref=- value=- offset=82129
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=82151
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=82161
  context: [[slot]]

## record-12 @ 85968

- Metadata: Average | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=157, variables=4, display=9, refs=42, slots=5, visibleChoices=4

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 1  rule: `rand(2)`
- fn1 = sin  rule: `if(num=1,"sin","cos")`
- ans = cos  rule: `if(num=1,"cos","sin")`
- dis1 = cos  rule: `if(num=1,"cos","sin")`

Inline slots:
- #1 variable-ref ref=fn1 value=sin offset=86732
  context: Which expression is equivalent to [[slot]]?
- #2 variable-ref ref=ans value=cos offset=86746
  context: [[slot]]
- #3 variable-ref ref=ans value=cos offset=86756
  context: [[slot]]
- #4 variable-ref ref=ans value=cos offset=86768
  context: [[slot]]
- #5 variable-ref ref=fn1 value=sin offset=86778
  context: [[slot]]

## record-13 @ 91061

- Metadata: Difficult | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=110, variables=0, display=7, refs=26, slots=3, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Express [[slot]] in terms of cosine and sine only, and simplify. A. C. B. [[slot]] D. [[slot]]
```

Choices:
- A. 0
- B. [[slot]]
- C. 1
- D. [[slot]]

Inline slots:
- #1 fixed-value ref=- value=- offset=91407
  context: Express [[slot]] in terms of cosine and sine only, and simplify.
- #2 unknown-object ref=- value=- offset=91535
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=91545
  context: [[slot]]

## record-14 @ 95051

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities
- Counts: strings=165, variables=6, display=9, refs=31, slots=5, visibleChoices=4

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 2  rule: `rand(2)`
- sym = ?  rule: `if(num=1,chr(43),chr(45))`
- ans = cos  rule: `if(num=1,"sin","cos")`
- fn1 = cos  rule: `choose(num,"sin","cos")`
- fn2 = sin  rule: `choose(num,"cos","sin")`
- dis = sin  rule: `if(num=1,"cos","sin")`

Inline slots:
- #1 variable-ref ref=fn1 value=cos offset=96005
  context: Which expression is equivalent to [[slot]]?
- #2 variable-ref ref=sym value=if(num=1,chr(43),chr(45)) offset=96017
  context: [[slot]]
- #3 variable-ref ref=fn2 value=sin offset=96027
  context: [[slot]]
- #4 variable-ref ref=dis value=sin offset=96039
  context: [[slot]]
- #5 variable-ref ref=ans value=cos offset=96049
  context: [[slot]]

## record-15 @ 100180

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | tangent | sum identities | difference identities
- Counts: strings=166, variables=7, display=9, refs=31, slots=5, visibleChoices=4

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- num = 1  rule: `rand(2)`
- sym1 = ?  rule: `if(num=1,chr(45),chr(43))`
- sym2 = ?  rule: `if(num=1,chr(43),chr(45))`
- ans = sin  rule: `if(num=1,"sin","cos")`
- fn1 = sin  rule: `choose(num,"sin","cos")`
- fn2 = cos  rule: `choose(num,"cos","sin")`
- dis = cos  rule: `if(num=1,"cos","sin")`

Inline slots:
- #1 variable-ref ref=sym1 value=if(num=1,chr(45),chr(43)) offset=101314
  context: Which expression is equivalent to [[slot]]?
- #2 variable-ref ref=sym2 value=if(num=1,chr(43),chr(45)) offset=101326
  context: [[slot]]
- #3 variable-ref ref=sym2 value=if(num=1,chr(43),chr(45)) offset=101336
  context: [[slot]]
- #4 variable-ref ref=sym1 value=if(num=1,chr(45),chr(43)) offset=101348
  context: [[slot]]
- #5 variable-ref ref=sym2 value=if(num=1,chr(43),chr(45)) offset=101358
  context: [[slot]]

## record-16 @ 105858

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | difference identities
- Counts: strings=136, variables=0, display=9, refs=25, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the exact value of [[slot]]. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]] 6

Inline slots:
- #1 unknown-object ref=- value=- offset=106232
  context: Determine the exact value of [[slot]].
- #2 unknown-object ref=- value=- offset=106244
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=106254
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=106266
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=106276
  context: [[slot]]

## record-17 @ 110823

- Metadata: Easy | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities | evaluate
- Counts: strings=66, variables=2, display=6, refs=10, slots=2, visibleChoices=4

```text
Simplify [[slot]]. A. C. B. D. [[slot]]
```

Choices:
- A. 0
- B. undefined
- C. 1
- D. 1 [[slot]]

Variables:
- angle1 = 19  rule: `range(10,170,1)`
- angle2 = 161  rule: `180-angle1`

Inline slots:
- #1 variable-ref ref=angle1 value=19 offset=111335
  context: Simplify [[slot]].
- #2 variable-ref ref=angle2 value=161 offset=111609
  context: [[slot]]

## record-18 @ 113649

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities | difference identities | evaluate
- Counts: strings=114, variables=9, display=9, refs=14, slots=5, visibleChoices=4

```text
Simplify [[slot]]. Round your answer to the nearest hundredth. A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Variables:
- angle1 = 168  rule: `range(10,170,1)`
- angle2 = 143  rule: `range(10,170,1)`
- sgn1 = [[slot]]  rule: `choose(rand(2),chr(43),chr(45))`
- ans1 = –0.754709580223  rule: `sin((angle1+angle2)*pi/180)`
- ans2 = 0.42261826174  rule: `sin((angle1-angle2)*pi/180)`
- ans = 0.42  rule: `if(sgn1=chr(43),ans1,ans2)`
- dis1 = –0.75  rule: `if(sgn1=chr(43),ans2,ans1)`
- dis2 = –1.15  rule: `tan((angle1+angle2)*pi/180)`
- dis3 = 0.47  rule: `tan((angle1-angle2)*pi/180)`

Inline slots:
- #1 variable-ref ref=angle1 value=168 offset=115221
  context: Simplify [[slot]]. Round your answer to the nearest hundredth.
- #2 variable-ref ref=angle2 value=143 offset=115321
  context: [[slot]]
- #3 variable-ref ref=sgn1 value=[[slot]] offset=115331
  context: [[slot]]
- #4 variable-ref ref=angle1 value=168 offset=115343
  context: [[slot]]
- #5 variable-ref ref=angle2 value=143 offset=115353
  context: [[slot]]

## record-19 @ 118349

- Metadata: Easy | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities | evaluate
- Counts: strings=66, variables=2, display=6, refs=10, slots=2, visibleChoices=4

```text
Simplify [[slot]]. A. C. B. D. [[slot]]
```

Choices:
- A. 1
- B. 1
- C. 0
- D. undefined

Variables:
- angle1 = 116  rule: `range(10,170,1)`
- angle2 = –26  rule: `90-angle1`

Inline slots:
- #1 variable-ref ref=angle1 value=116 offset=118861
  context: Simplify [[slot]].
- #2 variable-ref ref=angle2 value=–26 offset=119315
  context: [[slot]]

## record-20 @ 121431

- Metadata: Difficult | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities | evaluate | difference identities
- Counts: strings=137, variables=0, display=9, refs=29, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=121875
  context: Which expression is equivalent to [[slot]]?
- #2 unknown-object ref=- value=- offset=121887
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=121897
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=121909
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=121919
  context: [[slot]]

## record-21 @ 126454

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | double-angle identities
- Counts: strings=142, variables=0, display=9, refs=25, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Which expression is equivalent to [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=126842
  context: Which expression is equivalent to [[slot]]?
- #2 unknown-object ref=- value=- offset=126854
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=126864
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=126876
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=126886
  context: [[slot]]

## record-22 @ 131295

- Metadata: Difficult | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | double-angle identities
- Counts: strings=127, variables=0, display=9, refs=33, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]] is equivalent to A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 unknown-object ref=- value=- offset=131619
  context: [[slot]] is equivalent to
- #2 unknown-object ref=- value=- offset=131663
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=131673
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=131685
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=131695
  context: [[slot]]

## record-23 @ 136038

- Metadata: Difficult | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | double-angle identities | sum identities
- Counts: strings=263, variables=0, display=9, refs=73, slots=5, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]] can be rewritten as A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 unknown-object ref=- value=- offset=136396
  context: [[slot]] can be rewritten as
- #2 unknown-object ref=- value=- offset=136446
  context: [[slot]]
- #3 unknown-object ref=- value=- offset=136456
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=136468
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=136478
  context: [[slot]]

## record-24 @ 145251

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | reciprocal identity
- Counts: strings=164, variables=0, display=9, refs=39, slots=6, visibleChoices=4
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the solution to the equation [[slot]] over the domain [[slot]]? A. [[slot]] C. [[slot]] B. [[slot]] D. [[slot]]
```

Choices:
- A. [[slot]]
- B. [[slot]]
- C. [[slot]]
- D. [[slot]]

Inline slots:
- #1 math-object ref=- value=- offset=145645
  context: What is the solution to the equation [[slot]] over the domain [[slot]]?
- #2 math-object ref=- value=- offset=145681
  context: What is the solution to the equation [[slot]] over the domain [[slot]]?
- #3 unknown-object ref=- value=- offset=145693
  context: [[slot]]
- #4 unknown-object ref=- value=- offset=145703
  context: [[slot]]
- #5 unknown-object ref=- value=- offset=145715
  context: [[slot]]
- #6 unknown-object ref=- value=- offset=145725
  context: [[slot]]

## record-25 @ 150520

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | reciprocal identity
- Counts: strings=104, variables=0, display=12, refs=16, slots=2, visibleChoices=5
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the solution to the equation [[slot]] over the domain [[slot]]? A. 60 and 240 C. no solution B. 120, 180, and 240 D. 120
```

Choices:
- A. 60 and 240
- B. 120, 180, and 240
- C. no solution
- D. 120
- H. a

Inline slots:
- #1 math-object ref=- value=- offset=150914
  context: What is the solution to the equation [[slot]] over the domain [[slot]]?
- #2 math-object ref=- value=- offset=150950
  context: What is the solution to the equation [[slot]] over the domain [[slot]]?

## record-26 @ 153916

- Metadata: Difficult | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | double-angle identities | general solutions
- Counts: strings=203, variables=2, display=9, refs=53, slots=9, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the general solution, in degress, to the equation [[slot]]? A. [[slot]]. where [[slot]] C. [[slot]], where [[slot]] B. [[slot]], where [[slot]] D. [[slot]], where [[slot]]
```

Choices:
- A. [[slot]]. where [[slot]]
- B. [[slot]], where [[slot]]
- C. [[slot]], where [[slot]]
- D. [[slot]], where [[slot]]

Variables:
- angle1 = 64  rule: `range(10,170,1)`
- angle2 = 26  rule: `90-angle1`

Inline slots:
- #1 math-object ref=- value=- offset=154576
  context: What is the general solution, in degress, to the equation [[slot]]?
- #2 unknown-object ref=- value=- offset=154588
  context: [[slot]]. where [[slot]]
- #3 unknown-object ref=- value=- offset=154606
  context: [[slot]]. where [[slot]]
- #4 unknown-object ref=- value=- offset=154616
  context: [[slot]], where [[slot]]
- #5 unknown-object ref=- value=- offset=154634
  context: [[slot]], where [[slot]]
- #6 unknown-object ref=- value=- offset=154646
  context: [[slot]], where [[slot]]
- #7 unknown-object ref=- value=- offset=154664
  context: [[slot]], where [[slot]]
- #8 unknown-object ref=- value=- offset=154674
  context: [[slot]], where [[slot]]
- #9 unknown-object ref=- value=- offset=154692
  context: [[slot]], where [[slot]]

## record-27 @ 161213

- Metadata: Difficult | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | double-angle identities | general solutions
- Counts: strings=183, variables=2, display=9, refs=46, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the general solution, in radians, to the equation [[slot]]? A. [[slot]] where [[slot]] C. [[slot]] where [[slot]] B. no solution D. [[slot]] where [[slot]]
```

Choices:
- A. [[slot]] where [[slot]]
- B. no solution
- C. [[slot]] where [[slot]]
- D. [[slot]] where [[slot]]

Variables:
- angle1 = 78  rule: `range(10,170,1)`
- angle2 = 12  rule: `90-angle1`

Inline slots:
- #1 math-object ref=- value=- offset=161873
  context: What is the general solution, in radians, to the equation [[slot]]?
- #2 unknown-object ref=- value=- offset=161885
  context: [[slot]] where [[slot]]
- #3 unknown-object ref=- value=- offset=161901
  context: [[slot]] where [[slot]]
- #4 unknown-object ref=- value=- offset=161911
  context: [[slot]] where [[slot]]
- #5 unknown-object ref=- value=- offset=161927
  context: [[slot]] where [[slot]]
- #6 unknown-object ref=- value=- offset=161969
  context: [[slot]] where [[slot]]
- #7 unknown-object ref=- value=- offset=161985
  context: [[slot]] where [[slot]]

## record-28 @ 167303

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | double-angle identities | general solutions
- Counts: strings=182, variables=2, display=9, refs=45, slots=7, visibleChoices=4
- Suspicious: slot-without-variable-ref

```text
What is the general solution, in radians, to the equation [[slot]]? A. [[slot]], where [[slot]] C. no solution B. [[slot]], where [[slot]] D. [[slot]], where [[slot]]
```

Choices:
- A. [[slot]], where [[slot]]
- B. [[slot]], where [[slot]]
- C. no solution
- D. [[slot]], where [[slot]]

Variables:
- angle1 = 60  rule: `range(10,170,1)`
- angle2 = 30  rule: `90-angle1`

Inline slots:
- #1 math-object ref=- value=- offset=167959
  context: What is the general solution, in radians, to the equation [[slot]]?
- #2 unknown-object ref=- value=- offset=167971
  context: [[slot]], where [[slot]]
- #3 unknown-object ref=- value=- offset=167989
  context: [[slot]], where [[slot]]
- #4 unknown-object ref=- value=- offset=168031
  context: [[slot]], where [[slot]]
- #5 unknown-object ref=- value=- offset=168049
  context: [[slot]], where [[slot]]
- #6 unknown-object ref=- value=- offset=168059
  context: [[slot]], where [[slot]]
- #7 unknown-object ref=- value=- offset=168077
  context: [[slot]], where [[slot]]

## record-29 @ 173319

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | reciprocal identities | quotient identities | Pythagorean identities
- Counts: strings=132, variables=4, display=1, refs=42, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
[[slot]][[slot]][[slot]] are known as the _______________ identities.
```

Variables:
- num = 2  rule: `rand(3)`
- eq1 = 0  rule: `if(num=1,true,false)`
- eq2 = 1  rule: `if(num=2,true,false)`
- eq3 = 0  rule: `if(num=3,true,false)`

Inline slots:
- #1 variable-ref ref=eq1 value=0 offset=174009
  context: [[slot]][[slot]][[slot]] are known as the _______________ identities.
- #2 variable-ref ref=eq2 value=1 offset=174011
  context: [[slot]][[slot]][[slot]] are known as the _______________ identities.
- #3 unknown-object ref=- value=- offset=174013
  context: [[slot]][[slot]][[slot]] are known as the _______________ identities.

## record-30 @ 179041

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | trigonometric identity
- Counts: strings=11, variables=0, display=1, refs=1, slots=0, visibleChoices=0

```text
An equation with trigonometric expressions that is true for all values of the variable for which the expressions are defined is called a trigonometric _______________.
```

## record-31 @ 180805

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | general solutions
- Counts: strings=140, variables=4, display=1, refs=46, slots=3, visibleChoices=0

```text
The general solution, in degrees, for the equation [[slot]][[slot]][[slot]] is _______________.
```

Variables:
- num = 3  rule: `rand(3)`
- eq1 = 0  rule: `if(num=1,true,false)`
- eq2 = 0  rule: `if(num=2,true,false)`
- eq3 = 1  rule: `if(num=3,true,false)`

Inline slots:
- #1 variable-ref ref=eq1 value=0 offset=181501
  context: The general solution, in degrees, for the equation [[slot]][[slot]][[slot]] is _______________ .
- #2 variable-ref ref=eq2 value=0 offset=181503
  context: The general solution, in degrees, for the equation [[slot]][[slot]][[slot]] is _______________ .
- #3 variable-ref ref=eq3 value=1 offset=181505
  context: The general solution, in degrees, for the equation [[slot]][[slot]][[slot]] is _______________ .

## record-32 @ 186541

- Metadata: Easy | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | reciprocal identities | quotient identities | Pythagorean identities
- Counts: strings=176, variables=4, display=1, refs=59, slots=6, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
```

Variables:
- num = 1  rule: `rand(3)`
- eq1 = 1  rule: `if(num=1,true,false)`
- eq2 = 0  rule: `if(num=2,true,false)`
- eq3 = 0  rule: `if(num=3,true,false)`

Inline slots:
- #1 variable-ref ref=eq1 value=1 offset=187239
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
- #2 variable-ref ref=eq2 value=0 offset=187241
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
- #3 variable-ref ref=eq1 value=1 offset=187243
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
- #4 variable-ref ref=eq2 value=0 offset=187299
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
- #5 unknown-object ref=- value=- offset=187301
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]
- #6 unknown-object ref=- value=- offset=187303
  context: The [[slot]][[slot]][[slot]] identities are defined as [[slot]][[slot]][[slot]]

## record-33 @ 194522

- Metadata: Average | Section 6.3 | T6 | Proving Identities | trigonometric identity
- Counts: strings=13, variables=0, display=1, refs=0, slots=0, visibleChoices=0

```text
A trigonometric identity is a relation among trigonometric ratios that is ____________________ for all values of the variables for which both sides are ____________________.
```

## record-34 @ 196252

- Metadata: Average | Section 6.3 | T6 | Proving Identities | quotient identities | reciprocal identities
- Counts: strings=26, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=196488
  context: [[slot]]

## record-35 @ 197908

- Metadata: Average | Section 6.3 | T6 | Proving Identities | reciprocal identities
- Counts: strings=27, variables=0, display=1, refs=6, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=198100
  context: [[slot]]

## record-36 @ 199539

- Metadata: Average | Section 6.3 | T6 | Proving Identities | difference identities | sum identities
- Counts: strings=52, variables=1, display=5, refs=7, slots=1, visibleChoices=0

```text
Difficult + Section 6.3 Proving Identities double-angle identities [[slot]]
```

Variables:
- d = ?  rule: `-`

Inline slots:
- #1 variable-ref ref=d value=- offset=201496
  context: [[slot]]

## record-37 @ 202967

- Metadata: Average | Section 6.3 | T6 | Proving Identities | difference identities | sum identities
- Counts: strings=25, variables=0, display=1, refs=5, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
[[slot]]
```

Inline slots:
- #1 unknown-object ref=- value=- offset=203193
  context: [[slot]]

## record-38 @ 204684

- Metadata: Average | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | difference identities | exact value
- Counts: strings=73, variables=0, display=1, refs=25, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Find the exact value of [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=205004
  context: Find the exact value of [[slot]].

## record-39 @ 208321

- Metadata: Difficult | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | sum identities | exact value
- Counts: strings=73, variables=0, display=1, refs=24, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Find the exact value of [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=208631
  context: Find the exact value of [[slot]] .

## record-40 @ 212129

- Metadata: Difficult | Section 6.1 | T6 | Reciprocal, Quotient, and Pythagorean Identities | exact value
- Counts: strings=265, variables=0, display=1, refs=82, slots=3, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Determine the value of [[slot]] if [[slot]] and [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=212411
  context: Determine the value of [[slot]] if [[slot]] and [[slot]].
- #2 unknown-object ref=- value=- offset=212421
  context: Determine the value of [[slot]] if [[slot]] and [[slot]].
- #3 unknown-object ref=- value=- offset=212433
  context: Determine the value of [[slot]] if [[slot]] and [[slot]].

## record-41 @ 223967

- Metadata: Average | Section 6.3 | T6 | Proving Identities | counterexample
- Counts: strings=142, variables=1, display=1, refs=36, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref

```text
Use a counterexample to show that [[slot]] is not an identity.
```

Variables:
- counterexample = 7  rule: `ψ`

Inline slots:
- #1 math-object ref=- value=- offset=224213
  context: Use a counterexample to show that [[slot]] is not an identity.

## record-42 @ 229385

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | Pythagorean identities | trigonometric identity
- Counts: strings=84, variables=0, display=1, refs=26, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=229797
  context: Prove the identity [[slot]].

## record-43 @ 234346

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | Pythagorean identities | trigonometric identity
- Counts: strings=85, variables=0, display=1, refs=28, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Is the equation [[slot]] true for all values of
```

Inline slots:
- #1 math-object ref=- value=- offset=234752
  context: Is the equation [[slot]] true for all values of

## record-44 @ 239043

- Metadata: Easy | Section 6.3 | T6 | Proving Identities | reciprocal identities | trigonometric identity | graphing
- Counts: strings=117, variables=1, display=1, refs=23, slots=5, visibleChoices=0

```text
Graph [[slot]][[slot]]Graph [[slot]][[slot]]The graphs are the same for the range [[slot]].
```

Variables:
- d = P  rule: `[[slot]]`

Inline slots:
- #1 variable-ref ref=d value=P offset=240800
  context: Graph [[slot]] [[slot]] Graph [[slot]] [[slot]] The graphs are the same for the range [[slot]].
- #2 variable-ref ref=d value=P offset=240804
  context: Graph [[slot]] [[slot]] Graph [[slot]] [[slot]] The graphs are the same for the range [[slot]].
- #3 variable-ref ref=d value=P offset=240820
  context: Graph [[slot]] [[slot]] Graph [[slot]] [[slot]] The graphs are the same for the range [[slot]].
- #4 variable-ref ref=d value=P offset=240824
  context: Graph [[slot]] [[slot]] Graph [[slot]] [[slot]] The graphs are the same for the range [[slot]].
- #5 variable-ref ref=d value=P offset=240904
  context: Graph [[slot]] [[slot]] Graph [[slot]] [[slot]] The graphs are the same for the range [[slot]].

## record-45 @ 255554

- Metadata: Easy | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | exact value
- Counts: strings=87, variables=0, display=1, refs=26, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the solution for [[slot]] for [[slot]]?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=255830
  context: What is the solution for [[slot]] for [[slot]]?
- #2 unknown-object ref=- value=- offset=255842
  context: What is the solution for [[slot]] for [[slot]]?

## record-46 @ 259812

- Metadata: Difficult | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | exact value | general solutions
- Counts: strings=118, variables=0, display=1, refs=38, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve [[slot]]. State the solution in general form.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=260100
  context: Solve [[slot]]. State the solution in general form.

## record-47 @ 265414

- Metadata: Difficult | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | exact value | general solutions | quadratic formula
- Counts: strings=131, variables=0, display=1, refs=39, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve [[slot]]. State the general solution to the nearest degree.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=265742
  context: Solve [[slot]]. State the general solution to the nearest degree.

## record-48 @ 271573

- Metadata: Difficult | Section 6.2 | T6 | Sum, Difference, and Double-Angle Identities | difference identities
- Counts: strings=210, variables=0, display=1, refs=52, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
A skateboard ramp is built with an incline angle of [[slot]]. If the base of the ramp is 1 m in length, determine the exact height of the ramp.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=271925
  context: A skateboard ramp is built with an incline angle of [[slot]] . If the base of the ramp is 1 m in length, determine the exact height of the ramp.

## record-49 @ 299519

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | Pythagorean identities | proof
- Counts: strings=94, variables=0, display=1, refs=35, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=299897
  context: Prove the identity [[slot]].

## record-50 @ 304437

- Metadata: Average | Section 6.1 | Section 6.2 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Sum, Difference, and Double-Angle Identities | Proving Identities | difference identities | sum identities | quotient identities | proof
- Counts: strings=96, variables=0, display=1, refs=40, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=305013
  context: Prove the identity [[slot]].

## record-51 @ 309307

- Metadata: Difficult | Section 6.1 | Section 6.2 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Sum, Difference, and Double-Angle Identities | Proving Identities | Pythagorean identities | double-angle identities
- Counts: strings=133, variables=0, display=1, refs=51, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=309847
  context: Prove the identity [[slot]].

## record-52 @ 317668

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | Pythagorean identities | equation
- Counts: strings=107, variables=0, display=1, refs=28, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
If [[slot]], for what value(s) of k does [[slot]]?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=317950
  context: If [[slot]], for what value(s) of k does [[slot]]?
- #2 unknown-object ref=- value=- offset=318012
  context: If [[slot]], for what value(s) of k does [[slot]]?

## record-53 @ 322429

- Metadata: Average | Section 6.2 | Section 6.3 | T6 | Sum, Difference, and Double-Angle Identities | Proving Identities | double-angle identities | proof
- Counts: strings=93, variables=0, display=1, refs=38, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=322801
  context: Prove the identity [[slot]].

## record-54 @ 327624

- Metadata: Average | Section 6.3 | T6 | Proving Identities | trigonometric identity | proof
- Counts: strings=75, variables=0, display=1, refs=30, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=327872
  context: Prove the identity [[slot]].

## record-55 @ 332056

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | Pythagorean identities | proof
- Counts: strings=76, variables=0, display=1, refs=26, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=332434
  context: Prove the identity [[slot]].

## record-56 @ 336171

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | quotient identities | proof
- Counts: strings=90, variables=0, display=1, refs=49, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=336543
  context: Prove the identity [[slot]].

## record-57 @ 341667

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | reciprocal trigonometric ratios | unit circle
- Counts: strings=93, variables=0, display=1, refs=24, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
An angle satisfies the relation [[slot]].a) Use the definition of the reciprocal trigonometric ratios to express the left side of the relation in terms of the sine and/or cosine ratios.b) Determine the value(s) for the angle. Do not use a calculator.c) Verify your answer to part b) using a calculator.d) Show your answer to part b) using a unit circle.
```

Inline slots:
- #1 unknown-object ref=- value=- offset=342031
  context: An angle satisfies the relation [[slot]]. a) Use the definition of the reciprocal trigonometric ratios to express the left side of

## record-58 @ 356030

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | reciprocal trigonometric ratios | Pythagorean identities | proof
- Counts: strings=112, variables=0, display=1, refs=36, slots=1, visibleChoices=1
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Use the expressions for the reciprocal trigonometric ratios in terms of x, y, and r to show that [[slot]] for all values of A.
```

Choices:
- H. v

Inline slots:
- #1 unknown-object ref=- value=- offset=356632
  context: expressions for the reciprocal trigonometric ratios in terms of x, y, and r to show that [[slot]] for all values of A.

## record-59 @ 362178

- Metadata: Average | Section 6.1 | Section 6.3 | T6 | Reciprocal, Quotient, and Pythagorean Identities | Proving Identities | reciprocal trigonometric ratios | proof
- Counts: strings=78, variables=0, display=1, refs=28, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove that the equation [[slot]] is true for all values of x.
```

Inline slots:
- #1 math-object ref=- value=- offset=362584
  context: Prove that the equation [[slot]] is true for all values of x.

## record-60 @ 366460

- Metadata: Difficult | Section 6.2 | Section 6.3 | T6 | Sum, Difference, and Double-Angle Identities | Proving Identities | sum identities | proof
- Counts: strings=106, variables=0, display=1, refs=47, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Prove the identity [[slot]].
```

Inline slots:
- #1 math-object ref=- value=- offset=366818
  context: Prove the identity [[slot]].

## record-61 @ 372611

- Metadata: Easy | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | double-angle identities | equation
- Counts: strings=253, variables=0, display=1, refs=75, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the solution to the equation [[slot]] for [[slot]]?
```

Inline slots:
- #1 math-object ref=- value=- offset=372957
  context: What is the solution to the equation [[slot]] for [[slot]]?
- #2 math-object ref=- value=- offset=372969
  context: What is the solution to the equation [[slot]] for [[slot]]?

## record-62 @ 391460

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | general solutions | equation
- Counts: strings=200, variables=0, display=1, refs=76, slots=1, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
What is the general solution to [[slot]]?
```

Inline slots:
- #1 unknown-object ref=- value=- offset=391790
  context: What is the general solution to [[slot]]?

## record-63 @ 399944

- Metadata: Average | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | general solutions | quadratic equation
- Counts: strings=77, variables=0, display=1, refs=22, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve [[slot]] over the domain [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=400242
  context: Solve [[slot]] over the domain [[slot]].
- #2 unknown-object ref=- value=- offset=400278
  context: Solve [[slot]] over the domain [[slot]].

## record-64 @ 404536

- Metadata: Easy | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | general solutions | quadratic equation
- Counts: strings=208, variables=0, display=1, refs=71, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve [[slot]] over the domain [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=404828
  context: Solve [[slot]] over the domain [[slot]].
- #2 unknown-object ref=- value=- offset=404864
  context: Solve [[slot]] over the domain [[slot]].

## record-65 @ 412728

- Metadata: Easy | Section 6.4 | T6 | Solving Trigonometric Equations Using Identities | general solutions | quadratic equation
- Counts: strings=17, variables=0, display=1, refs=3, slots=2, visibleChoices=0
- Suspicious: slot-without-variable-ref, slots-but-no-algorithmic-variables

```text
Solve [[slot]] over the domain [[slot]].
```

Inline slots:
- #1 unknown-object ref=- value=- offset=413020
  context: Solve [[slot]] over the domain [[slot]].
- #2 unknown-object ref=- value=- offset=413056
  context: Solve [[slot]] over the domain [[slot]].

