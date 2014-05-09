package dk.in2isoft.onlineobjects.modules.index;

import java.util.Collection;

import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.NumericRangeQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.BooleanClause.Occur;

public class IndexUtil {
	
	public static Query newLongQuery(String field,Collection<Long> ids) {
		if (ids.size()==1) {
			Long next = ids.iterator().next().longValue();
			return newLongQuery(field, next);
		}
		BooleanQuery combined = new BooleanQuery();
		for (Long number : ids) {
			combined.add(newLongQuery(field, number),Occur.SHOULD);
		}
		return combined;
	}

	public static NumericRangeQuery<Long> newLongQuery(String field, Long next) {
		return NumericRangeQuery.newLongRange(field, next, next, true, true);
	}
}
