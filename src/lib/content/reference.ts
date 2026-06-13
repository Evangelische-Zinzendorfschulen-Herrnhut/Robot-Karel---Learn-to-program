export const conditionRows = [
  ['front_is_clear()', 'front_is_blocked()', 'Ist vor Karel der Weg frei?'],
  ['beepers_present()', 'no_beepers_present()', 'Liegt auf Karels Feld ein Beeper?'],
  ['left_is_clear()', 'left_is_blocked()', 'Ist links von Karel der Weg frei?'],
  ['right_is_clear()', 'right_is_blocked()', 'Ist rechts von Karel der Weg frei?'],
  ['beepers_in_bag()', 'no_beepers_in_bag()', 'Hat Karel Beeper in der Tasche?'],
  ['facing_north()', 'not_facing_north()', 'Schaut Karel nach Norden?'],
  ['facing_south()', 'not_facing_south()', 'Schaut Karel nach Süden?'],
  ['facing_east()', 'not_facing_east()', 'Schaut Karel nach Osten?'],
  ['facing_west()', 'not_facing_west()', 'Schaut Karel nach Westen?'],
];

export const commandReferenceRows = [
  ['move()', 'Karel geht ein Feld nach vorne.'],
  ['turn_left()', 'Karel dreht sich um 90 Grad nach links.'],
  ['turn_right()', 'Karel dreht sich um 90 Grad nach rechts.'],
  ['turn_around()', 'Karel dreht sich um 180 Grad.'],
  ['pick_beeper()', 'Karel hebt einen Beeper auf dem aktuellen Feld auf.'],
  ['put_beeper()', 'Karel legt einen Beeper auf dem aktuellen Feld ab.'],
  ['paint_field("blue")', 'Karel bemalt das aktuelle Feld mit der angegebenen Farbe.'],
];
