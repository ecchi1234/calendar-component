import { StringFilter  } from '@react3l/advanced-filters';
import { IdFilter  } from '@react3l/advanced-filters';
import { NumberFilter  } from '@react3l/advanced-filters';
import { DateFilter  } from '@react3l/advanced-filters';
import { GuidFilter  } from '@react3l/advanced-filters';
import { ModelFilter } from '@react3l/react3l/core';

export class AppUserFilter extends ModelFilter  {
  public id?: IdFilter = new IdFilter();
  public username?: StringFilter = new StringFilter();
  public displayName?: StringFilter = new StringFilter();
  public address?: StringFilter = new StringFilter();
  public email?: StringFilter = new StringFilter();
  public phone?: StringFilter = new StringFilter();
  public sexId?: IdFilter = new IdFilter();
  public birthday?: DateFilter = new DateFilter();
  public avatar?: StringFilter = new StringFilter();
  public department?: StringFilter = new StringFilter();
  public organizationId?: IdFilter = new IdFilter();
  public longitude?: NumberFilter = new NumberFilter();
  public latitude?: NumberFilter = new NumberFilter();
  public statusId?: IdFilter = new IdFilter();
  public rowId?: GuidFilter = new GuidFilter();
}
