package dk.in2isoft.commons.xml;

import java.util.Set;

import nu.xom.Document;
import nu.xom.Element;
import nu.xom.Text;

import com.google.common.collect.Sets;

public class DocumentToText {
	
	private Set<String> ignore = Sets.newHashSet("script","head","style","noscript");

	private Set<String> singleBlocks = Sets.newHashSet("div","br","li","dt","dd");
	private Set<String> doubleBlocks = Sets.newHashSet("p","h1","h2","h3","h4","h5","h6","ol","ul","dl");
	
	private int newLines = 0;

	public DocumentToText() {
		// TODO Auto-generated constructor stub
	}

    public String getText(Document doc) {
        StringBuffer data = new StringBuffer();
        traverse(doc,data);
        String text = data.toString();
        return text;
    }
    
    private void traverse(nu.xom.Node parent, StringBuffer data) {
    	if (parent==null) return;
        int count = parent.getChildCount();
        for (int i=0;i<count;i++) {
            nu.xom.Node node = parent.getChild(i);
            if (node instanceof Text) {
                String value = node.getValue();
                if (value.length() > 0) {
                	while (newLines > 0) {
                		data.append("\n");
                		newLines--;
                	}
                    value = value.replaceAll("\\t"," ");
                    value = value.replaceAll("\\s{2,}", " ");
                    //value = value.replaceAll("\\s{2,}", " ");                	
    				data.append(value);
                }
            }
            else {
            	if (node instanceof Element) {
            		Element element = (Element) node;
            		String name = element.getLocalName().toLowerCase();
            		if (data.length() > 0) {
            			if (singleBlocks.contains(name)) {
            				newLines = Math.max(newLines, 1);
            			}
            			if (doubleBlocks.contains(name)) {
            				newLines = Math.max(newLines, 2);
            			}
            		}
					if (!ignore.contains(name)) {
                        traverse(node,data);
            		}
            		if (data.length() > 0) {
            			if (singleBlocks.contains(name)) {
            				newLines = Math.max(newLines, 1);
            			}
            			if (doubleBlocks.contains(name)) {
            				newLines = Math.max(newLines, 2);
            			}
            		}
            	}
            }
        }
        
    }
}
