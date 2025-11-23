namespace ordermanagement;

using {managed} from '@sap/cds/common';

entity Dummy : managed {
  key ID                   : UUID;
      name                 : String(100)
                             @Core.Description: 'Name';
      val                  : String(100)
                             @Core.Description: 'Wert';

}
