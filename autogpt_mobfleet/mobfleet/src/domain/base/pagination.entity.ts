/* eslint-disable max-classes-per-file */
import { BaseEntity } from './base.entity';
import { Type, Expose as JsonProperty } from 'class-transformer';
import { OrderByCondition } from 'typeorm';

export class Sort {
    public property: string;
    public direction: 'ASC' | 'DESC' | string;
    constructor(sort: string) {
        if (sort) {
            [this.property, this.direction] = sort.split(',');
            this.direction = this.direction?.toUpperCase();
        }
    }

    asOrder(): any {
        const order = {};
        order[this.property] = this.direction;
        return order;
    }
}

export class PageRequest {
    @JsonProperty()
    page = 0;
    @JsonProperty()
    size = 20;
    @JsonProperty()
    skip? = 0;
    @JsonProperty()
    search?: string;

    @JsonProperty()
    filter?: any;

    @JsonProperty()
    contractID?: any;

    @Type(() => Sort)
    sort: Sort;

    constructor(page: any, size: any, sort: any, search?: any, filter?: any, contractID?: any) {
        this.page = +(page ?? this.page);
        this.size = +(size ?? this.size);
        this.skip = this.page * this.size;
        this.sort = sort ? new Sort(sort) : this.sort;
        this.search = search;
        this.filter = filter;
        this.contractID = contractID;

        if (this.size < 0) {
            this.page = 0;
            this.skip = 0;
            this.size = this.size === -1 ? undefined : 20;
        };
    }
}

export class Page<T extends BaseEntity> {
    constructor(public content: T[], public total: number, public pageable: PageRequest) {}
}
