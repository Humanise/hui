<?xml version="1.0"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<xsl:template match="gui:formula">
	<form class="in2igui_formula" id="{generate-id()}">
		<xsl:apply-templates/>
	</form>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula('<xsl:value-of select="generate-id()"/>');		
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="descendant::gui:group/gui:text | descendant::gui:group/gui:password | descendant::gui:group/gui:datetime | descendant::gui:group/gui:checkboxes | descendant::gui:group/gui:checkbox | descendant::gui:group/gui:radiobuttons | descendant::gui:group/gui:imagepicker | descendant::gui:objectlist | descendant::gui:tokens">
			registerInput(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:formula//gui:header">
	<div class="in2igui_formula_header"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="gui:formula//gui:group">
	<table class="in2igui_formula_group">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:formula//gui:group[@labels='above']">
	<table class="in2igui_formula_group in2igui_formula_group_above">
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

<xsl:template match="gui:group/gui:custom">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:apply-templates/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:custom">
	<tr><td>
			<label><xsl:value-of select="@label"/></label>
			<xsl:apply-templates/>
	</td></tr>
</xsl:template>

<!-- Text -->

<xsl:template match="gui:group/gui:text">
	<param name="parent"/>
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:text"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:text">
	<param name="parent"/>
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:text"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:text">
	<xsl:choose>
		<xsl:when test="@lines>1">
			<div class="in2igui_field in2igui_longfield" id="{generate-id()}">
			<textarea class="in2igui_formula_text" rows="{@lines}"/>
			</div>
		</xsl:when>
		<xsl:otherwise>
			<div class="in2igui_field" id="{generate-id()}">
			<input type="text" class="in2igui_formula_text"/>
			</div>
		</xsl:otherwise>
	</xsl:choose>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Text('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'key':'<xsl:value-of select="@key"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Password -->

<xsl:template match="gui:group/gui:password">
	<tr>
		<xsl:if test="../@labels='above'">
			<label><xsl:value-of select="@label"/></label>
			<xsl:call-template name="gui:password"/>
		</xsl:if>
		<xsl:if test="not(../@labels='above')">
			<th><label><xsl:value-of select="@label"/></label></th>
			<td><xsl:call-template name="gui:password"/></td>
		</xsl:if>
	</tr>
</xsl:template>

<xsl:template name="gui:password">
	<div class="in2igui_field" id="{generate-id()}">
		<input type="password" class="in2igui_formula_text"/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Text('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'key':'<xsl:value-of select="@key"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Date time -->

<xsl:template match="gui:group/gui:datetime">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:datetime"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:datetime">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:datetime"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:datetime">
	<div class="field">
	<input type="text" class="text" id="{generate-id()}"/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.DateTime('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Select -->

<xsl:template match="gui:group/gui:select">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:select"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:select">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:select"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:select">
	<select id="{generate-id()}">
	<xsl:apply-templates/>
	</select>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Select('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{source:'<xsl:value-of select="@source"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Radio buttons -->



<xsl:template match="gui:group/gui:radiobuttons">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:radiobuttons"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:radiobuttons">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:radiobuttons"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:radiobuttons">
	<div class="radiobuttons" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Radiobuttons('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'value':'<xsl:value-of select="@value"/>'});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:radiobutton">
				registerRadiobutton({id:'<xsl:value-of select="generate-id()"/>','value':'<xsl:value-of select="@value"/>'});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:radiobuttons/gui:radiobutton">
	<div id="{generate-id()}">
		<xsl:attribute name="class">radiobutton <xsl:if test="@value=../@value">selected</xsl:if></xsl:attribute>
		<div class="radio"><xsl:comment/></div><xsl:value-of select="@label"/>
	</div>
</xsl:template>

<!-- Checkbox -->

<xsl:template match="gui:group/gui:checkbox">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:checkbox"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:checkbox">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:checkboxes"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:checkbox">
	<div id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>checkbox</xsl:text>
			<xsl:if test="@value='true'"> checked</xsl:if>
		</xsl:attribute>
		<div class="check"><xsl:comment/></div>
	</div>
	<div class="checkboxes">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkbox('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'value':'<xsl:value-of select="@value"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Checkboxes -->

<xsl:template match="gui:group/gui:checkboxes">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:checkboxes"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:checkboxes">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:checkboxes"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:checkboxes">
	<div class="checkboxes" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkboxes('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:source">
				registerSource(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:checkboxes/gui:source">
	<div id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkboxes.Source('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{url:'<xsl:value-of select="@url"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Buttons -->

<xsl:template match="gui:formula/gui:buttons">
	<div class="in2igui_formula_buttons">
		<xsl:if test="@pad"><xsl:attribute name="style">padding: <xsl:value-of select="@pad"/>px;</xsl:attribute></xsl:if>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template match="gui:group/gui:buttons">
	<tr>
		<td colspan="2">
			<xsl:apply-templates/>
		</td>
	</tr>
</xsl:template>

<xsl:template match="gui:buttons/gui:button">
	<a id="{generate-id()}">
		<xsl:attribute name="class">in2igui_button<xsl:if test="@highlighted='true'"> in2igui_button_highlighted</xsl:if></xsl:attribute>
		<span><span><xsl:value-of select="@title"/></span></span></a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Button('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:group/gui:button">
	<tr>
		<td colspan="2"><a id="{generate-id()}">
			<xsl:attribute name="class">in2igui_button<xsl:if test="@highlighted='true'"> in2igui_button_highlighted</xsl:if></xsl:attribute>
			<span><span><xsl:value-of select="@title"/></span></span></a></td>
	</tr>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Button('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--                Image picker                -->

<xsl:template match="gui:group/gui:imagepicker">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td>
			<xsl:call-template name="gui:imagepicker"/>
		</td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:imagepicker">
	<tr>
		<td>
			<label><xsl:value-of select="@label"/></label>
			<xsl:call-template name="gui:imagepicker"/>
		</td>
	</tr>
</xsl:template>

<xsl:template name="gui:imagepicker">
	<div class="in2igui_imagepicker" id="{generate-id()}" tabindex="0">
		
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ImagePicker(
			'<xsl:value-of select="generate-id()"/>',
			'<xsl:value-of select="@name"/>',
			{'source':'<xsl:value-of select="@source"/>'}
			);
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!--             Tokens            -->

<xsl:template match="gui:group/gui:tokens">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td>
			<xsl:call-template name="gui:tokens"/>
		</td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:tokens">
	<tr>
		<td>
			<label><xsl:value-of select="@label"/></label>
			<xsl:call-template name="gui:tokens"/>
		</td>
	</tr>
</xsl:template>

<xsl:template name="gui:tokens">
	<div class="in2igui_tokens" id="{generate-id()}" tabindex="0">
		
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Tokens(
			'<xsl:value-of select="generate-id()"/>',
			'<xsl:value-of select="@name"/>',
			{'key':'<xsl:value-of select="@key"/>'}
			);
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>



<!--             Object List             -->




<xsl:template match="gui:group/gui:objectlist">
	<tr><td colspan="2">
		<xsl:call-template name="gui:objectlist"/>
	</td></tr>
</xsl:template>

<xsl:template match="gui:objectlist" name="gui:objectlist">
	<table cellspacing="0" cellpadding="0" id="{generate-id()}" class="in2igui_objectlist">
		<xsl:if test="gui:text/@label">
			<thead>
				<tr>
					<xsl:for-each select="gui:text | gui:select">
						<th class="in2igui_objectlist in2igui_objectlist{position()}" style="width: {100 div count(../*)}%;"><xsl:value-of select="@label"/></th>
					</xsl:for-each>
				</tr>
			</thead>
		</xsl:if>
		<tbody>
			<xsl:comment/>
		</tbody>
	</table>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ObjectList('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:apply-templates select="gui:text | gui:select"/>
			ignite();
		}
	</script>
</xsl:template>

<xsl:template match="gui:objectlist/gui:text">
	registerTemplateItem(new In2iGui.ObjectList.Text('<xsl:value-of select="@key"/>'));
</xsl:template>

<xsl:template match="gui:objectlist/gui:select">
	<xsl:variable name="id" select="generate-id()"/>
	var <xsl:value-of select="$id"/> = new In2iGui.ObjectList.Select('<xsl:value-of select="@key"/>');
	<xsl:for-each select="gui:option">
		<xsl:value-of select="$id"/>.addOption('<xsl:value-of select="@value"/>','<xsl:value-of select="@label"/>');
	</xsl:for-each>
	registerTemplateItem(<xsl:value-of select="generate-id()"/>);
</xsl:template>

</xsl:stylesheet>