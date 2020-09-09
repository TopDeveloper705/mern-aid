/* eslint-env jest */
import { imgSnapshotTest } from '../../helpers/util';
describe('Class diagram V2', () => {

    it('0: should render a simple class diagram', () => {
      imgSnapshotTest(
        `
        classDiagram-v2

        classA -- classB : Inheritance
        classA -- classC : link
        classC -- classD : link
        classB -- classD

        `,
        {logLevel : 1, flowchart: { "htmlLabels": false },}
      );
      cy.get('svg');
    });

  it('1: should render a simple class diagram', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      Class01 <|-- AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class03 *-- Class04
      Class05 o-- Class06
      Class07 .. Class08
      Class09 --> C2 : Where am i?
      Class09 --* C3
      Class09 --|> Class07
      Class12 <|.. Class08
      Class11 ..>Class12
      Class07 : equals()
      Class07 : Object[] elementData
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class01 : -int privateChimp
      Class01 : +int publicGorilla
      Class01 : #int protectedMarmoset
      Class08 <--> C2: Cool label
      class Class10 {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
      {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('2: should render a simple class diagrams with cardinality', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      Class01 "1" <|--|> "*" AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class03 "1" *-- "*" Class04
      Class05 "1" o-- "many" Class06
      Class07 "1" .. "*" Class08
      Class09 "1" --> "*" C2 : Where am i?
      Class09 "*" --* "*" C3
      Class09 "1" --|> "1" Class07
      Class07  : equals()
      Class07  : Object[] elementData
      Class01  : size()
      Class01  : int chimp
      Class01  : int gorilla
      Class08 "1" <--> "*" C2: Cool label
      class Class10 {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
      {logLevel : 1, flowchart: { "htmlLabels": false },}

    );
    cy.get('svg');
  });

  it('should render a simple class diagram with different visibilities', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      Class01 <|-- AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class01 : -privateMethod()
      Class01 : +publicMethod()
      Class01 : #protectedMethod()
      Class01 : -int privateChimp
      Class01 : +int publicGorilla
      Class01 : #int protectedMarmoset
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('should render multiple class diagrams', () => {
    imgSnapshotTest(
      [
      `
    classDiagram-v2
      Class01 "1" <|--|> "*" AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class03 "1" *-- "*" Class04
      Class05 "1" o-- "many" Class06
      Class07 "1" .. "*" Class08
      Class09 "1" --> "*" C2 : Where am i?
      Class09 "*" --* "*" C3
      Class09 "1" --|> "1" Class07
      Class07  : equals()
      Class07  : Object[] elementData
      Class01  : size()
      Class01  : int chimp
      Class01  : int gorilla
      Class08 "1" <--> "*" C2: Cool label
      class Class10 {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
      `
    classDiagram-v2
      Class01 "1" <|--|> "*" AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class03 "1" *-- "*" Class04
      Class05 "1" o-- "many" Class06
      Class07 "1" .. "*" Class08
      Class09 "1" --> "*" C2 : Where am i?
      Class09 "*" --* "*" C3
      Class09 "1" --|> "1" Class07
      Class07  : equals()
      Class07  : Object[] elementData
      Class01  : size()
      Class01  : int chimp
      Class01  : int gorilla
      Class08 "1" <--> "*" C2: Cool label
      class Class10 {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
      ],
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('4: should render a simple class diagram with comments', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      %% this is a comment
      Class01 <|-- AveryLongClass : Cool
      &lt;&lt;interface&gt;&gt; Class01
      Class03 *-- Class04
      Class05 o-- Class06
      Class07 .. Class08
      Class09 --> C2 : Where am i?
      Class09 --* C3
      Class09 --|> Class07
      Class07 : equals()
      Class07 : Object[] elementData
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
      class Class10 {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('5: should render a simple class diagram with abstract method', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      Class01 <|-- AveryLongClass : Cool
      Class01 : someMethod()*
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('6: should render a simple class diagram with static method', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      Class01 <|-- AveryLongClass : Cool
      Class01 : someMethod()$
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('7: should render a simple class diagram with Generic class', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
    class Class01~T~
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
      class Class10~T~ {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('8: should render a simple class diagram with Generic class and relations', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
    Class01~T~ <|-- AveryLongClass : Cool
    Class03~T~ *-- Class04~T~
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
      class Class10~T~ {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('9: should render a simple class diagram with clickable link', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
    Class01~T~ <|-- AveryLongClass : Cool
    Class03~T~ *-- Class04~T~
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
      class Class10~T~ {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      link class01 "google.com" "A Tooltip"
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('10: should render a simple class diagram with clickable callback', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
    Class01~T~ <|-- AveryLongClass : Cool
    Class03~T~ *-- Class04~T~
      Class01 : size()
      Class01 : int chimp
      Class01 : int gorilla
      Class08 <--> C2: Cool label
      class Class10~T~ {
        &lt;&lt;service&gt;&gt;
        int id
        test()
      }
      callback class01 "functionCall" "A Tooltip"
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('11: should render a simple class diagram with return type on method', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      class Class10~T~ {
        int[] id
        test(int[] ids) bool
        testArray() bool[]
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('12: should render a simple class diagram with generic types', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      class Class10~T~ {
        int[] id
        List~int~ ids
        test(List~int~ ids) List~bool~
        testArray() bool[]
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('13: should render a simple class diagram with css classes applied', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      class Class10 {
        int[] id
        List~int~ ids
        test(List~int~ ids) List~bool~
        testArray() bool[]
      }

      cssClass "Class10" exClass
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('14: should render a simple class diagram with css classes applied directly', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      class Class10:::exClass {
        int[] id
        List~int~ ids
        test(List~int~ ids) List~bool~
        testArray() bool[]
      }
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });

  it('15: should render a simple class diagram with css classes applied two multiple classes', () => {
    imgSnapshotTest(
      `
    classDiagram-v2
      class Class10
      class Class20

      cssClass "Class10, class20" exClass
      `,
       {logLevel : 1, flowchart: { "htmlLabels": false },}
    );
    cy.get('svg');
  });
});
