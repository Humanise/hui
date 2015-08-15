package dk.in2isoft.onlineobjects.apps.community.remoting;

import java.util.List;

import dk.in2isoft.in2igui.data.ListDataRow;
import dk.in2isoft.in2igui.data.ListObjects;
import dk.in2isoft.onlineobjects.core.Query;
import dk.in2isoft.onlineobjects.core.exceptions.EndUserException;
import dk.in2isoft.onlineobjects.core.exceptions.IllegalRequestException;
import dk.in2isoft.onlineobjects.model.RemoteAccount;
import dk.in2isoft.onlineobjects.ui.AbstractRemotingFacade;

public class CommunityToolsRemotingFacade extends AbstractRemotingFacade {

	public ListObjects listAccounts() throws EndUserException {
		ListObjects list = new ListObjects();
		Query<RemoteAccount> query = new Query<RemoteAccount>(RemoteAccount.class).withPrivileged(getUserSession());
		List<RemoteAccount> accounts = modelService.list(query);
		for (RemoteAccount account : accounts) {
			ListDataRow row = new ListDataRow();
			row.addColumn("id", account.getId());
			row.addColumn("username", account.getUsername());
			row.addColumn("domain", account.getDomain());
			list.addRow(row);
		}
		return list;
	}
	
	public void saveAccount(RemoteAccount dummy) throws EndUserException {
		RemoteAccount account;
		if (dummy.getId() > 0) {
			account = modelService.get(RemoteAccount.class, dummy.getId(), getRequest().getSession());
			if (account==null) {
				throw new IllegalRequestException("Not found");
			}
		} else {
			account = new RemoteAccount();			
		}
		account.setUsername(dummy.getUsername());
		account.setDomain(dummy.getDomain());
		modelService.createOrUpdateItem(account, getUserSession());
	}
}
