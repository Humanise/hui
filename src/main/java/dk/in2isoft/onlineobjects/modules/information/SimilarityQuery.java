package dk.in2isoft.onlineobjects.modules.information;

import org.hibernate.SQLQuery;

import dk.in2isoft.onlineobjects.core.CustomQuery;
import dk.in2isoft.onlineobjects.modules.information.SimilarityQuery.Similarity;

public class SimilarityQuery implements CustomQuery<Similarity> {

	public class Similarity {
		private Long id;
		private Double similarity;

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Double getSimilarity() {
			return similarity;
		}

		public void setSimilarity(Double similarity) {
			this.similarity = similarity;
		}
	}

	private long id;

	@Override
	public String getSQL() {

		String sql = "select relation.sub_entity_id as id, relation.strength from relation,internetaddress"
				+ " where relation.kind='common.similarity' and relation.strength>0.15 and relation.super_entity_id=:id and internetaddress.id=relation.sub_entity_id" 
				+ " union"
				+ " select relation.super_entity_id as id, relation.strength from relation,internetaddress"
				+ " where relation.kind='common.similarity' and relation.strength>0.15 and relation.sub_entity_id=:id and internetaddress.id=relation.super_entity_id"

				+ " order by strength desc";

		return sql;
	}

	@Override
	public String getCountSQL() {
		return null;
	}

	public SimilarityQuery withId(long id) {
		this.id = id;
		return this;
	}

	@Override
	public Similarity convert(Object[] row) {
		if (row[0] != null && row[0] instanceof Number) {
			if (row[1] != null && row[1] instanceof Number) {
				Similarity result = new Similarity();
				Long id = ((Number) row[0]).longValue();
				Double similarity = ((Number) row[1]).doubleValue();
				result.setId(id);
				result.setSimilarity(similarity);
				return result;
			}
		}
		return null;
	}

	@Override
	public void setParameters(SQLQuery sql) {
		sql.setLong("id", id);
	}
}
