package dk.in2isoft.onlineobjects.modules.information;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.modules.information.MissingSimilarityQuery.SimilarityResult;

public class MissingSimilarityQuery implements CustomQuery<SimilarityResult> {

	public class SimilarityResult {
		private Long firstId;
		private Long secondId;
		private Long userId;
		public Long getFirstId() {
			return firstId;
		}
		public void setFirstId(Long firstId) {
			this.firstId = firstId;
		}
		public Long getSecondId() {
			return secondId;
		}
		public void setSecondId(Long secondId) {
			this.secondId = secondId;
		}
		public Long getUserId() {
			return userId;
		}
		public void setUserId(Long userId) {
			this.userId = userId;
		}
	}

	@Override
	public String getSQL() {
		
		String sql = " SELECT A.id AS a_id, B.id AS b_id, usr.id AS user_id FROM internetaddress AS A CROSS JOIN internetaddress AS B " +

			" INNER JOIN privilege AS a_priv ON A.id = a_priv.object AND a_priv.view=TRUE AND a_priv.alter=TRUE" +
			" INNER JOIN privilege AS b_priv ON B.id = b_priv.object AND b_priv.view=TRUE AND b_priv.alter=TRUE" +

			" INNER JOIN \"user\" AS usr" +
				"  ON usr.username NOT IN ('admin','public') AND a_priv.subject = usr.id " +
				"  AND b_priv.subject = usr.id" +

			" LEFT JOIN relation ON relation.kind='common.similarity' AND ((A.id = relation.super_entity_id AND relation.sub_entity_id=B.id) OR (B.id = relation.super_entity_id AND  relation.sub_entity_id=A.id)) " +


			" WHERE A.id!=B.id" +

			" AND NOT EXISTS (SELECT 1 FROM privilege AS rel_priv WHERE relation.id = rel_priv.object AND rel_priv.subject=usr.id AND rel_priv.view=TRUE AND rel_priv.alter=TRUE )" +

			" ORDER BY a_id, b_id DESC";
		
		sql = "SELECT A.id AS a_id, B.id AS b_id,usr.id as user_id FROM internetaddress AS A CROSS JOIN internetaddress AS B  " +
				"INNER JOIN privilege AS a_priv ON A.id = a_priv.object AND a_priv.view=TRUE AND a_priv.alter=TRUE " +
				"INNER JOIN privilege AS b_priv ON B.id = b_priv.object AND b_priv.view=TRUE AND b_priv.alter=TRUE " +
				"INNER JOIN \"user\" AS usr ON usr.username NOT IN ('admin','public') AND a_priv.subject = usr.id AND b_priv.subject = usr.id " +
				"WHERE A.id!=B.id " +
				"AND NOT EXISTS (SELECT 1 FROM relation INNER JOIN privilege AS rel_priv ON relation.id = rel_priv.object AND rel_priv.subject=usr.id AND rel_priv.view=TRUE WHERE relation.kind='common.similarity' AND ((A.id = relation.super_entity_id AND relation.sub_entity_id=B.id) OR (B.id = relation.super_entity_id AND relation.sub_entity_id=A.id)))";

		// Ordering is disabled since it is very expensive
		//sql+= " ORDER BY a_id DESC, b_id DESC";
		sql+= " LIMIT 100";
		
		
		
		return sql;
	}

	@Override
	public String getCountSQL() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public SimilarityResult convert(Object[] row) {
		if (row[0]!=null && row[0] instanceof Number) {
			if (row[1]!=null && row[1] instanceof Number) {
				SimilarityResult result = new SimilarityResult();
				Long a = ((Number) row[0]).longValue();
				Long b = ((Number) row[1]).longValue();
				Long c = ((Number) row[2]).longValue();
				result.setFirstId(a);
				result.setSecondId(b);
				result.setUserId(c);
				return result;
			}
		}
		return null;
	}

	@Override
	public void setParameters(SQLQuery sql) {
		//sql.setLong("privileged", privilegedId);
	}
}


