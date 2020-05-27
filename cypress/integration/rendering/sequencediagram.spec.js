/// <reference types="Cypress" />

import { imgSnapshotTest } from '../../helpers/util';

context('Sequence diagram', () => {
  it('should render a simple sequence diagram', () => {
    imgSnapshotTest(
      `
      sequenceDiagram
        participant Alice
        participant Bob
        participant John as John<br/>Second Line
        Alice ->> Bob: Hello Bob, how are you?
        Bob-->>John: How about you John?
        Bob--x Alice: I am good thanks!
        Bob-x John: I am good thanks!
        Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.
        Bob-->Alice: Checking with John...
        alt either this
          Alice->>John: Yes
          else or this
          Alice->>John: No
          else or this will happen
          Alice->John: Maybe
        end
        par this happens in parallel
        Alice -->> Bob: Parallel message 1
        and
        Alice -->> John: Parallel message 2
        end
      `,
      {}
    );
  });
  it('should handle different line breaks', () => {
    imgSnapshotTest(
      `
      sequenceDiagram
      participant 1 as multiline<br>using #lt;br#gt;
      participant 2 as multiline<br/>using #lt;br/#gt;
      participant 3 as multiline<br />using #lt;br /#gt;
      participant 4 as multiline<br \t/>using #lt;br \t/#gt;
      1->>2: multiline<br>using #lt;br#gt;
      note right of 2: multiline<br>using #lt;br#gt;
      2->>3: multiline<br/>using #lt;br/#gt;
      note right of 3: multiline<br/>using #lt;br/#gt;
      3->>4: multiline<br />using #lt;br /#gt;
      note right of 4: multiline<br />using #lt;br /#gt;
      4->>1: multiline<br />using #lt;br /#gt;
      note right of 1: multiline<br \t/>using #lt;br \t/#gt;
    `,
      {}
    );
  });
  it('should render loops with a slight margin', () => {
    imgSnapshotTest(
      `
        sequenceDiagram
        Alice->>Bob: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        loop Loopy
            Bob->>Alice: Pasten
        end      `,
      {}
    );
  });
  context('font settings', () => {
    it('should render different note fonts when configured', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        note left of Alice: I should have bigger fonts
        Bob->>Alice: Short as well
      `,
        { sequence: { noteFontSize: 18, noteFontFamily: 'Arial' } }
      );
    });
    it('should render different message fonts when configured', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        Bob->>Alice: Short as well
      `,
        { sequence: { messageFontSize: 18, messageFontFamily: 'Arial' } }
      );
    });
    it('should render different actor fonts when configured', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        Bob->>Alice: Short as well
      `,
        { sequence: { actorFontSize: 18, actorFontFamily: 'Arial' } }
      );
    });
    it('should render notes aligned to the left when configured', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        note left of Alice: I am left aligned
        Bob->>Alice: Short as well
      `,
        { sequence: { noteAlign: 'left' } }
      );
    });
    it('should render notes aligned to the right when configured', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        note left of Alice: I am right aligned
        Bob->>Alice: Short as well
      `,
        { sequence: { noteAlign: 'right' } }
      );
    });
  });
  context('auth width scaling', () => {
    it('should render long actor descriptions', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        participant A as Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        A->>Bob: Hola
        Bob-->A: Pasten !
      `,
        {}
      );
    });
    it('should render long notes left of actor', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: Hola
        Note left of Alice: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        Bob->>Alice: I'm short though
      `,
        {}
      );
    });
    it('should render long notes right of actor', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: Hola
        Note right of Alice: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        Bob->>Alice: I'm short though
      `,
        {}
      );
    });
    it('should render long notes over actor', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: Hola
        Note over Alice: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        Bob->>Alice: I'm short though
      `,
        {}
      );
    });
    it('should render long messages from an actor to the left to one to the right', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
        Bob->>Alice: I'm short though
      `,
        {}
      );
    });
    it('should render long messages from an actor to the right to one to the left', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>Bob: I'm short
        Bob->>Alice: Extremely utterly long line of longness which had preivously overflown the actor box as it is much longer than what it should be
      `,
        {}
      );
    });
  });
  context('background rects', () => {
    it('should render a single and nested rects', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
          participant A
          participant B
          participant C
          participant D
          participant E
          participant G

          A ->>+ B: Task 1
          rect rgb(178, 102, 255)
            B ->>+ C: Task 2
            C -->>- B: Return
          end

          A ->> D: Task 3
          rect rgb(0, 128, 255)
            D ->>+ E: Task 4
            rect rgb(0, 204, 0)
            E ->>+ G: Task 5
            G -->>- E: Return
            end
            E ->> E: Task 6
          end
          D -->> A: Complete
      `,
        {}
      );
    });
    it('should render rect around and inside loops', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
          A ->> B: 1
          rect rgb(204, 0, 102)
            loop check C
              C ->> C: Every 10 seconds
            end
          end
          A ->> B: 2
          loop check D
            C ->> D: 3
            rect rgb(153, 153, 255)
            D -->> D: 5
            D --> C: 4
            end
          end
      `,
        {}
      );
    });
    it('should render rect around and inside alts', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
          A ->> B: 1
          rect rgb(204, 0, 102)
            alt yes
              C ->> C: 1
            else no
              rect rgb(0, 204, 204)
                C ->> C: 0
              end
            end
          end
          B ->> A: Return
      `,
        {}
      );
    });
    it('should render rect around and inside opts', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
          A ->> B: 1
          rect rgb(204, 0, 102)
            opt maybe
              C -->> D: Do something
              rect rgb(0, 204, 204)
                C ->> C: 0
              end
            end
          end

          opt possibly
            rect rgb(0, 204, 204)
              C ->> C: 0
            end
          end
          B ->> A: Return
      `,
        {}
      );
    });
    it('should render autonumber when configured with such', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        Alice->>John: Hello John, how are you?
        loop Healthcheck
            John->>John: Fight against hypochondria
        end
        Note right of John: Rational thoughts!
        John-->>Alice: Great!
        John->>Bob: How about you?
        Bob-->>John: Jolly good!
      `,
        { sequence: { actorMargin: 50, showSequenceNumbers: true } }
      );
    });
    it('should render autonumber when autonumber keyword is used', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        autonumber
        Alice->>John: Hello John, how are you?
        loop Healthcheck
            John->>John: Fight against hypochondria
        end
        Note right of John: Rational thoughts!
        John-->>Alice: Great!
        John->>Bob: How about you?
        Bob-->>John: Jolly good!
      `,
        {}
      );
    });
    it('should render autonumber with different line breaks', () => {
      imgSnapshotTest(
        `
        sequenceDiagram
        autonumber
        Alice->>John: Hello John,<br>how are you?
        Alice->>John: John,<br/>can you hear me?
        John-->>Alice: Hi Alice,<br />I can hear you!
        John-->>Alice: I feel great!
      `,
        {}
      );
    });
  });
});
