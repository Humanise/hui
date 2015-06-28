package dk.in2isoft.commons.util;


public class HQLBuilder {

	private String method;
	private StringBuilder from;
	private StringBuilder select;
	private StringBuilder where;
	private StringBuilder orderBy;
	
	public HQLBuilder() {
		super();
		this.method="select";
		this.from = new StringBuilder();
		this.select = new StringBuilder();
		this.where = new StringBuilder();
		this.orderBy = new StringBuilder();
	}
	
	public HQLBuilder from(String str) {
		if (from.length()>0) {
			from.append(",");
		}
		from.append(str);
		return this;
	}
	
	public HQLBuilder where(String str) {
		if (where.length()>0) {
			where.append(" and ");
		}
		where.append(str);
		return this;
	}
	
	public HQLBuilder orderBy(String str) {
		if (orderBy.length()>0) {
			orderBy.append(",");
		}
		orderBy.append(str);
		return this;
	}

	public HQLBuilder from(Class<?> clss, String string) {
		return from(clss.getName()+" as "+string);
	}

	public HQLBuilder select(String... strings) {
		for (String string : strings) {
			if (select.length()>0) {
				select.append(",");
			}
			select.append(string);
		}
		return this;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder(method).append(" ");
		sb.append(select);
		if (from.length()>0) {
			sb.append(" from ").append(from);
		}
		if (where.length()>0) {
			sb.append(" where ").append(where);
		}
		if (orderBy.length()>0) {
			sb.append(" order by ").append(orderBy);
		}
		return sb.toString();
	}
}
