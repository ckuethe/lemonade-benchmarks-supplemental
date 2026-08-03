# Model Quality Assessment using Lemonade

This toolkit is used to subjectively assess the quality of various vision
models. So far two task types are defined: transcription and vision.

Consult the
[CLI Guide](https://lemonade-server.ai/docs/guide/cli/#scenario-files) for
details on scenario construction or use `make_scenarios.py` to produce a
scenario file for a directory of images.

Start by running `bench_driver.sh`. This will produce a file such as
`ryzen_vision.ndjson`.

Once this has completed, begin the review process with
`./bench_vision_review.py --results ryzen_vision.ndjson --scenarios task_vision/bench_scenarios.json`

This will open a web browser which will allow you to evaluate the model
output and produce a leaderboard.

In the `ryzen` directory there are some example evaluation results.
 
## Transcription / OCR

This is just what it seems. Given images of text (especially with poor
visual quality) the goal is to find the model best able to correctly
extract meaning from a fax of a 3rd generation photocopy of a microfiche
of a mimeograph of a 70 year old typed document.

Historical documents from the early days of the Space Race or the Cold War
are very effective test documents. If an OCR model can parse that stuff, it
will almost certainly produce satisfactory results digitizing your receipts.

## Vision

This requires more human interpretation. There are various factors, but some
key principles:

- If there is an obviously distinctive item, it must be precisely identified.
- Incorrect identification is a hard fail. Don't tell me that a dog is a cat.
- picking up subtle details is required for full points
- hallucinated details are a fail

### Scoring examples
- thing_12_sign
  * `-` wrong type of snake
  * `-` wrong background color
  * `-` features that don't exist (a shoe)

- thing_09_trevi
  * `+` must say "trevi fountain"
  * `-` must be in english

- thing_08_sculpture
  * `+` must notice the bird

- thing_07_sculpture
  * `+` must say "anubis" (distinctive)
  * `-` fail=wrong animal

- thing_06_portrait
  * `+` must identify davinci

- thing_04_sr71
  * `+` must say "sr71" (distinctive)
  * `-` fail=wrong plane

- thing_03_enigma
  * `+` must say "enigma"
  * `-` fail=wrong device (typewriter, synthesizer, lorenz)

- thing_01_car
  * `+` must say "s2000" (distinctive)
  * `-` fail=wrong car, wrong direction, open top, seeing inside, etc.

- thing_00_radiotelescope
  * `+` must say something about radio telescope or astronomy
  * `+` must see rainbow

- nature_xxx_nebula
  * `+` must correctly identify the nebula
  * `-` fail=wrong nebula

- animal_06_fennec
  * `+` must say fennec
  * `-` not saying fennec (too distinctive)

- animal_xx_redpanda
  * `+` must say redpanda
  * `-` not saying redpanda (too distinctive)

- animal_13_dog
  * `+` must recognize the dog jumping
  * `+` must recognize the dog is in the air - the shadow shows it's clearly in the air
  * `-` must not say the dog is in any way standing

- nature_xx_flower
  * `-` not saying "bird of paradise" (too distinctive)
  * `+` detailed description
