<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >
<xsl:include href="tabbox.xsl"/>
<xsl:include href="layout.xsl"/>

<xsl:output encoding="UTF-8" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>


<xsl:variable name="context"><xsl:value-of select="/gui:gui/@context"/></xsl:variable>

<xsl:template match="gui:gui">
<html>
<head>
<title></title>
<link rel="stylesheet" href="{$context}In2iGui/css/master.css" type="text/css" media="screen" title="no title" charset="utf-8"/>
<script src="{$context}XmlWebGui/Scripts/In2iScripts.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}XmlWebGui/Scripts/In2iRequest.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}XmlWebGui/Scripts/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/In2iGui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/Window.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/Formula.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/List.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/Icons.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/Tabs.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/ViewStack.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<script src="{$context}In2iGui/js/Tabbox.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
<xsl:for-each select="gui:controller">
<script src="{@source}" type="text/javascript" charset="utf-8"><xsl:comment/></script>
</xsl:for-each>
<script type="text/javascript">
<xsl:for-each select="gui:controller">
	In2iGui.get().addDelegate(<xsl:value-of select="@name"/>);
</xsl:for-each>
</script>
<xsl:call-template name="dwr-setup"/>
</head>
<body>
<xsl:apply-templates/>
</body>
</html>
</xsl:template>

<xsl:template name="dwr-setup">
	<xsl:if test="gui:dwr">
		<script src="{gui:dwr/@base}engine.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{gui:dwr/@base}util.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<xsl:for-each select="gui:dwr/gui:interface">
			<script src="{../@base}interface/{@name}.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		</xsl:for-each>
		<script type="text/javascript">
			dwr.engine.setErrorHandler(In2iGui.dwrErrorHandler);
		</script>
	</xsl:if>
</xsl:template>

<xsl:template name="gui:createobject">
	<xsl:if test="@name">
		var <xsl:value-of select="@name"/> = <xsl:value-of select="generate-id()"/>_obj;
	</xsl:if>
</xsl:template>

<xsl:template match="gui:dock">
<table style="height: 100%; width: 100%;">
<tr><td style="font-size: 0px;">
<iframe src="{@source}" style="height: 100%; width: 100%; border: none; font-size: 0px;" frameborder="0" onload="this.style.height=this.parentNode.clientHeight+'px';"/>
</td></tr>
<tr><td style="height: 70px; background: red;">

</td></tr>
</table>
</xsl:template>

<xsl:template match="gui:split">
<table class="split">
<tr>
	<xsl:apply-templates select="gui:sidebar"/>
	<xsl:for-each select="gui:content">
		<td class="split_content"><xsl:value-of select="position()"/><xsl:apply-templates/></td>
	</xsl:for-each>
</tr>
</table>
</xsl:template>

<xsl:template match="gui:split/gui:sidebar">
	<td class="split_sidebar"><xsl:apply-templates/></td>
</xsl:template>

<xsl:template match="gui:sidebar/gui:selector">
	<div class="sidebar_selector" id="{generate-id()}"><xsl:apply-templates/></div>
	<script src="{$context}In2iGui/js/Sidebar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Sidebar.Selector('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@source"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:item">
				registerItem('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@title"/>','<xsl:value-of select="@icon"/>','<xsl:value-of select="@badge"/>','<xsl:value-of select="@value"/>','<xsl:value-of select="@selected"/>');
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:sidebar/gui:selector/gui:item">
	<div class="item" id="{generate-id()}">
		<xsl:if test="@icon">
		<xsl:attribute name="style">background-image: url('<xsl:value-of select="$context"/>In2iGui/icons/<xsl:value-of select="@icon"/>1.png');</xsl:attribute>
		</xsl:if>
		<xsl:if test="@badge"><span><xsl:value-of select="@badge"/></span></xsl:if>
		<xsl:value-of select="@title"/>
	</div>
</xsl:template>
	
<xsl:template match="gui:browser">
	<div class="browser" id="{generate-id()}">
		<div class="contents">
		<xsl:comment/>
		</div>
	</div>
	<script src="{$context}In2iGui/js/Browser.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Browser('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@source"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--             Icons            -->

<xsl:template match="gui:icons">
	<div class="icons" id="{generate-id()}">
		ICONS
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Icons('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{source:'<xsl:value-of select="@source"/>',windowSize:'<xsl:value-of select="gui:window/@size"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--             List            -->

<xsl:template match="gui:list">
	<div class="list" id="{generate-id()}">
		<div class="navigation"><span class="window_size"/><span class="window_number"/><span class="count"/></div>
		<table>
			<thead>
				<tr>
				<xsl:apply-templates select="gui:column"/>
				</tr>
			</thead>
			<tbody><xsl:comment/></tbody>
		</table>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.List('<xsl:value-of select="generate-id()"/>',{source:'<xsl:value-of select="@source"/>',windowSize:'<xsl:value-of select="gui:window/@size"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:list/gui:window"></xsl:template>

<xsl:template match="gui:column">
	<th>
		<xsl:if test="@width='min'"><xsl:attribute name="style">width: 1%;</xsl:attribute></xsl:if>
		<xsl:value-of select="@title"/>
	</th>
</xsl:template>

<!--                  View                      -->

<xsl:template match="gui:view">
	<table class="view">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:viewstack">
	<xsl:for-each select="gui:content">
	<div class="viewstack_content" id="{generate-id()}">
		<xsl:if test="position()>1">
			<xsl:attribute name="style">display: none;</xsl:attribute>
		</xsl:if>
		<xsl:apply-templates/>
	</div>
	</xsl:for-each>
	
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ViewStack('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="gui:content">
			registerContent('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:viewstack/gui:content">
</xsl:template>

<!--                             Tabs                             -->

<xsl:template match="gui:tabs">
<div class="tabs">
	<div class="tabs_bar">
		<xsl:for-each select="gui:tab">
		<span><xsl:value-of select="@title"/></span>
		</xsl:for-each>
	</div>
	<xsl:apply-templates select="gui:tab"/>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabs('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="descendant::gui:tab">
			registerTab(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
	</script>
</div>
</xsl:template>

<xsl:template match="gui:tabs/gui:tab">
	<div class="tab" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Tabs.Tab('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--                  Toolbar                   -->

<xsl:template match="gui:view/gui:toolbar">
	<tr class="toolbar"><td>
	<script src="{$context}In2iGui/js/Toolbar.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	<div class="toolbar"><xsl:apply-templates/></div>
	</td></tr>
</xsl:template>


<xsl:template match="gui:toolbar/gui:icon">
	<div class="toolbar_icon" id="{generate-id()}">
		<div class="icon" style="background-image: url('{$context}In2iGui/icons/{@icon}2.png')"><xsl:comment/></div>
		<span><xsl:value-of select="@title"/></span>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Toolbar.Icon('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:toolbar/gui:search">
	<div class="toolbar_search" id="{generate-id()}">
		<input type="text"/>
		<span><xsl:value-of select="@title"/></span>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Toolbar.SearchField('<xsl:value-of select="generate-id()"/>');
		<xsl:if test="@object">
			var <xsl:value-of select="@object"/> = <xsl:value-of select="generate-id()"/>_obj;
		</xsl:if>
	</script>
</xsl:template>

<xsl:template match="gui:view/gui:content">
	<tr><td class="view_content"><xsl:apply-templates/></td></tr>
</xsl:template>


<xsl:template match="gui:script[@source]">
	<script type="text/javascript" src="{@source}"><xsl:comment/></script>
</xsl:template>

<xsl:template match="gui:script">
	<script type="text/javascript">
		<xsl:apply-templates/>
	</script>
</xsl:template>

<xsl:template match="gui:overflow">
<div class="overflow" id="{generate-id()}">
	<xsl:apply-templates/>
</div>
<script type="text/javascript">
	In2iGui.get().registerOverflow('<xsl:value-of select="generate-id()"/>');
</script>
</xsl:template>

<!-- Window -->

<xsl:template match="gui:window">
	<div class="window floating_window" id="{generate-id()}">
		<div class="titlebar"><div class="close"><xsl:comment/>x</div><xsl:value-of select="@title"/></div>
		<div class="window_content">
 			<xsl:if test="@width"><xsl:attribute name="style">width: <xsl:value-of select="@width"/>px;</xsl:attribute></xsl:if>
			<xsl:apply-templates/>
		</div>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Window('<xsl:value-of select="generate-id()"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--                              Formula                              -->

<xsl:template match="gui:formula">
	<form class="formula" id="{generate-id()}">
		<xsl:apply-templates/>
	</form>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula('<xsl:value-of select="generate-id()"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="descendant::gui:text">
			registerInput(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:formula//gui:group">
	<table class="group">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:formula//gui:group[@legend]">
	<fieldset>
		<legend><xsl:value-of select="@legend"/></legend>
		<table class="group">
			<xsl:apply-templates/>
		</table>
	</fieldset>
</xsl:template>

<xsl:template match="gui:group/gui:text">
	<tr>
		<th><xsl:value-of select="@label"/></th>
		<td><div class="field"><input type="text" class="text" id="{generate-id()}"/></div></td>
	</tr>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Text('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:group/gui:button">
	<tr>
		<td><a class="button" id="{generate-id()}"><span><span><xsl:value-of select="@title"/></span></span></a></td>
	</tr>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Button('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Upload -->

<xsl:template match="gui:upload">
	<div class="upload" id="{generate-id()}">
		<input type="file"/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Upload('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>
	

</xsl:stylesheet>