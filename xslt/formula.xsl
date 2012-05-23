<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	xmlns="http://www.w3.org/1999/xhtml"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:gui="uri:hui"
    version="1.0"
    exclude-result-prefixes="gui fn"
    >

<!--doc title:'Formula' class:'hui.ui.Formula' module:'input'
<formula name="«name»" state="«text»" padding="«pixels»">
    <group···>
        ···
    </group>
</formula>
-->
<xsl:template match="gui:formula">
	<form class="hui_formula hui_formula" id="{generate-id()}">
		<xsl:attribute name="style">
			<xsl:if test="@state and (not(//gui:gui/@state) or @state!=//gui:gui/@state)">
				<xsl:text>display:none;</xsl:text>
			</xsl:if>
			<xsl:if test="@padding">padding: <xsl:value-of select="@padding"/>px;</xsl:if>
		</xsl:attribute>
		<xsl:apply-templates/>
	</form>
	<script type="text/javascript">
		(function() {
			var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Formula({
				element:'<xsl:value-of select="generate-id()"/>',
				name:'<xsl:value-of select="@name"/>'
				<xsl:if test="@state">
					,state:'<xsl:value-of select="@state"/>'
				</xsl:if>
			});
			<xsl:call-template name="gui:createobject"/>		
		}());
	</script>
</xsl:template>

<xsl:template match="gui:formula//gui:header">
	<div class="hui_formula_header"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="gui:formula//gui:group">
	<table class="hui_formula_group">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:formula//gui:group[@labels='above']">
	<table class="hui_formula_group hui_formula_group_above">
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

<!--doc title:'Fieldset' module:'input'
<fieldset legend="«text»">
    ···
</fieldset>
-->
<xsl:template match="gui:formula//gui:fieldset">
	<div class="hui_formula_fieldset">
		<strong class="hui_formula_fieldset"><xsl:value-of select="@legend"/></strong>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<!-- Field -->

<!--doc title:'Field' module:'input'
<group>
    <field label="«text»" hint="«text»">
        ···
    </field>
</group>
-->
<xsl:template match="gui:group/gui:field">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td class="hui_formula_group">
			<div class="hui_formula_item"><xsl:apply-templates/></div>
			<xsl:if test="@hint"><p class="hui_formula_field_hint"><xsl:value-of select="@hint"/></p></xsl:if>
		</td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:field">
	<tr><td>
		<xsl:if test="@label"><label><xsl:value-of select="@label"/></label></xsl:if>
		<div class="hui_formula_item"><xsl:apply-templates/></div>
		<xsl:if test="@hint"><p class="hui_formula_field_hint"><xsl:value-of select="@hint"/></p></xsl:if>
	</td></tr>
</xsl:template>

<!-- Text -->

<xsl:template match="gui:group/gui:text">
	<tr>
		<th>
			<xsl:if test="not(@lines>1) and not(@multiline='true')"><xsl:attribute name="class">hui_formula_middle</xsl:attribute></xsl:if>
			<label><xsl:value-of select="@label"/></label></th>
		<td class="hui_formula_group"><div class="hui_formula_item"><xsl:call-template name="gui:text"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:text">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<div class="hui_formula_item"><xsl:call-template name="gui:text"/></div>
	</td></tr>
</xsl:template>


<!--doc title:'Text input' class:'hui.ui.TextField' module:'input'
<text-input name="«name»" multiline="«boolean»" value="«text»"/>
-->
<xsl:template name="gui:text" match="gui:textfield | gui:text-input">
	<xsl:choose>
		<xsl:when test="@lines>1 or @multiline='true'">
			<div class="hui_field hui_longfield" id="{generate-id()}">
			
			<span class="hui_field_top"><span><span><xsl:comment/></span></span></span>
			<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content">
				<span class="hui_formula_text_multiline">
				<textarea class="hui_formula_text" rows="{@lines}"><xsl:value-of select="@value"/><xsl:text></xsl:text></textarea>
				</span>
			</span></span></span>
			<span class="hui_field_bottom"><span><span><xsl:comment/></span></span></span>
			</div>
		</xsl:when>
		<xsl:otherwise>
			<div class="hui_field" id="{generate-id()}">
			<span class="hui_field_top"><span><span><xsl:comment/></span></span></span>
			<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content">
				<span class="hui_field_singleline">
				<input class="hui_formula_text" value="{@value}">
					<xsl:if test="@secret='true'"><xsl:attribute name="type">password</xsl:attribute></xsl:if>
					<xsl:if test="@correction='false'">
						<xsl:attribute name="autocapitalize">off</xsl:attribute>
						<xsl:attribute name="autocorrect">off</xsl:attribute>
					</xsl:if>
				</input>
				</span>
			</span></span></span>
			<span class="hui_field_bottom"><span><span><xsl:comment/></span></span></span>
			</div>
		</xsl:otherwise>
	</xsl:choose>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.TextField({
			element : '<xsl:value-of select="generate-id()"/>',
			name : '<xsl:value-of select="@name"/>',
			key : '<xsl:value-of select="@key"/>'
			<xsl:if test="@animate-value-change='false'">
			,animateValueChange : <xsl:value-of select="@animate-value-change"/>
			</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Date time -->

<xsl:template match="gui:group/gui:datetime">
	<tr>
		<th class="hui_formula_middle"><label><xsl:value-of select="@label"/></label></th>
		<td><div class="hui_formula_item"><xsl:call-template name="gui:datetime"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:datetime">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<div class="hui_formula_item"><xsl:call-template name="gui:datetime"/></div>
	</td></tr>
</xsl:template>




<!--doc title:'Date-time input' module:'input'
<datetime-input name="«text»" key="«text»" return-type="«'date' | 'seconds'»"/>
-->
<xsl:template name="gui:datetime" match="gui:datetime-input">
	<div class="hui_field" id="{generate-id()}">
		<span class="hui_field_top"><span><span><xsl:comment/></span></span></span>
		<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content">
			<span class="hui_field_singleline">
				<input type="text" class="hui_formula_text"/>
				<a class="hui_datetime" href="javascript://" tabindex="-1"><span><xsl:comment/></span></a>
			</span>
		</span></span></span>
		<span class="hui_field_bottom"><span><span><xsl:comment/></span></span></span>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.DateTimeField({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			key:'<xsl:value-of select="@key"/>',
			returnType:'<xsl:value-of select="@return-type"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>




<!-- Number -->

<xsl:template match="gui:group/gui:number">
	<tr>
		<th class="hui_formula_middle"><label><xsl:value-of select="@label"/></label></th>
		<td class="hui_formula_group"><div class="hui_formula_item"><xsl:call-template name="gui:number"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:number">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<div class="hui_formula_item"><xsl:call-template name="gui:number"/></div>
	</td></tr>
</xsl:template>

<!--doc title:'Number input' module:'input'
<number-input name="«text»" key="«text»" adaptive="«boolean»" min="«number»" max="«number»" decimals="«integer»" value="«number»" allow-null="«boolean»" tick-size="«number»"/>
-->
<xsl:template name="gui:number" match="gui:number-input">
	<span id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>hui_numberfield</xsl:text>
			<xsl:if test="@adaptive='true'"><xsl:text> hui_numberfield_adaptive</xsl:text></xsl:if>
		</xsl:attribute>
		<span><span><input type="text" value="{@value}"/><em class="hui_numberfield_units"><xsl:comment/></em><a class="hui_numberfield_up"><xsl:comment/></a><a class="hui_numberfield_down"><xsl:comment/></a></span></span>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.NumberField({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			key:'<xsl:value-of select="@key"/>'
			<xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
			<xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
			<xsl:if test="@min">,min:<xsl:value-of select="@min"/></xsl:if>
			<xsl:if test="@max">,max:<xsl:value-of select="@max"/></xsl:if>
			<xsl:if test="@decimals">,decimals:<xsl:value-of select="@decimals"/></xsl:if>
			<xsl:if test="@allow-null">,allowNull:true</xsl:if>
			<xsl:if test="@value">,value : '<xsl:value-of select="@value"/>'</xsl:if>
			<xsl:if test="@tick-size">,tickSize : <xsl:value-of select="@tick-size"/></xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>





<!--doc title:'CSS length input' class:'hui.ui.StyleLength' module:'input'
<style-length-input name="«text»" key="«text»" value="«css-length»"/>
-->
<xsl:template name="gui:style-length" match="gui:style-length-input">
	<span class="hui_style_length hui_numberfield" id="{generate-id()}">
		<span><span><input type="text" value="{@value}"/><a class="hui_numberfield_up"><xsl:comment/></a><a class="hui_numberfield_down"><xsl:comment/></a></span></span>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.StyleLength({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			key:'<xsl:value-of select="@key"/>'
			<xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>





<!--doc title:'Color input' class:'hui.ui.ColorInput' module:'input'
<color-input name="«text»" key="«text»" value="«css-color»"/>
-->
<xsl:template match="gui:color-input">
	<span class="hui_colorinput" id="{generate-id()}">
		<span class="hui_field_top"><span><span><xsl:comment/></span></span></span>
			<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content">
				<span class="hui_field_singleline"><input type="text" value="{@value}"/></span>
			</span></span></span>
		<span class="hui_field_bottom"><span><span><xsl:comment/></span></span></span>
		<a class="hui_colorinput" href="javascript://" tabindex="-1"><xsl:comment/></a>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ColorInput({
			element:'<xsl:value-of select="generate-id()"/>'
			<xsl:if test="@value">,value:'<xsl:value-of select="@value"/>'</xsl:if>
			<xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
			<xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>



<!--doc title:'Location input' class:'hui.ui.LocationField' module:'input'
<location-input name="«text»" key="«text»" />
-->
<xsl:template match="gui:location-input">
	<span class="hui_locationfield" id="{generate-id()}">
		
		<span class="hui_field_top"><span><span><xsl:comment/></span></span></span>
			<span class="hui_field_middle"><span class="hui_field_middle"><span class="hui_field_content">
				<span>
					<span class="hui_locationfield_latitude"><span><input/></span></span><span class="hui_locationfield_longitude"><span><input/></span></span>
				</span>
			</span></span></span>
			<span class="hui_field_bottom"><span><span><xsl:comment/></span></span></span>
		<a class="hui_locationfield_picker" href="javascript://"><xsl:comment/></a>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.LocationField({
			element:'<xsl:value-of select="generate-id()"/>'
			<xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
			<xsl:if test="@key">,key:'<xsl:value-of select="@key"/>'</xsl:if>
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!-- dropdown -->

<xsl:template match="gui:group/gui:dropdown">
	<tr>
		<th class="hui_formula_middle"><label><xsl:value-of select="@label"/></label></th>
		<td class="hui_formula_group"><div class="hui_formula_item"><xsl:call-template name="gui:dropdown"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:dropdown">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<div class="hui_formula_item"><xsl:call-template name="gui:dropdown"/></div>
	</td></tr>
</xsl:template>

<!--doc title:'Drop down' class:'hui.ui.DropDown' module:'input'
<dropdown name="«text»" key="«text»" value="«text»" source="«name»" url="«url»" placeholder="«text»" adaptive="«boolean»" width="«pixels»">
	<item value="«text»" text="«text»"/>
</dropdown>
-->
<xsl:template name="gui:dropdown" match="gui:dropdown">
	<a id="{generate-id()}" href="javascript://">
		<xsl:if test="@width">
			<xsl:attribute name="style">width:<xsl:value-of select="@width"/>px;</xsl:attribute>
		</xsl:if>
	<xsl:attribute name="class">
		<xsl:choose>
			<xsl:when test="@adaptive='true'">hui_dropdown hui_dropdown_adaptive</xsl:when>
			<xsl:otherwise>hui_dropdown</xsl:otherwise>
		</xsl:choose>
	</xsl:attribute>	
	<span><span><strong><xsl:comment/></strong></span></span>
	</a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.DropDown(
			{element:'<xsl:value-of select="generate-id()"/>'
			,name:'<xsl:value-of select="@name"/>'
			,key:'<xsl:value-of select="@key"/>'
			,value:'<xsl:value-of select="@value"/>'
			<xsl:if test="@source">,source:<xsl:value-of select="@source"/></xsl:if>
			<xsl:if test="@url">,url:'<xsl:value-of select="@url"/>'</xsl:if>
			<xsl:if test="@placeholder">,placeholder:'<xsl:value-of select="@placeholder"/>'</xsl:if>
		});
		with(<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:item">
				
				addItem({
					title : '<xsl:value-of select="@title"/><xsl:value-of select="@label"/><xsl:value-of select="@text"/>',
					value : hui.intOrString('<xsl:call-template name="gui:escapeScript"><xsl:with-param name="text" select="@value"/></xsl:call-template>')
				});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>





<xsl:template match="gui:group/gui:radiobuttons">
	<tr>
		<th class="hui_formula_middle"><label><xsl:value-of select="@label"/></label></th>
		<td><div class="hui_formula_item"><xsl:call-template name="gui:radiobuttons"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:radiobuttons">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<div class="hui_formula_item"><xsl:call-template name="gui:radiobuttons"/></div>
	</td></tr>
</xsl:template>


<!--doc title:'Radio buttons' class:'hui.ui.Radiobuttons' module:'input'
<radiobuttons name="«text»" key="«text»" value="«text»">
	<item value="«text»" text="«text»"/>
</radiobuttons>
-->
<xsl:template name="gui:radiobuttons" match="gui:radiobuttons">
	<span class="hui_radiobuttons" id="{generate-id()}">
		<xsl:apply-templates/>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Radiobuttons({
			element : '<xsl:value-of select="generate-id()"/>',
			name : '<xsl:value-of select="@name"/>',
			value : '<xsl:value-of select="@value"/>',
			key : '<xsl:value-of select="@key"/>'
		});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:radiobutton | gui:item">
				registerRadiobutton({id:'<xsl:value-of select="generate-id()"/>','value':'<xsl:value-of select="@value"/>'});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:radiobuttons/gui:radiobutton | gui:radiobuttons/gui:item">
	<a id="{generate-id()}" href="javascript://">
		<xsl:attribute name="class">
			<xsl:text>hui_radiobutton</xsl:text>
			<xsl:if test="@value=../@value"> hui_radiobutton_selected</xsl:if>
		</xsl:attribute>
		<span class="hui_radiobutton_button"><span><xsl:comment/></span></span>
		<span class="hui_radiobutton_label"><xsl:value-of select="@label"/><xsl:value-of select="@text"/></span>
	</a>
</xsl:template>






<xsl:template match="gui:group/gui:checkbox">
	<tr>
		<th class="hui_formula_middle"><label><xsl:value-of select="@label"/></label></th>
		<td><div class="hui_formula_item"><xsl:call-template name="gui:checkbox"/></div></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:checkbox">
	<tr><td>
		<label style="float: left; line-height: 21px; padding-right: 5px; height: 24px;"><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:checkbox"/>
	</td></tr>
</xsl:template>

<!--doc title:'Check box' class:'hui.ui.Checkbox' module:'input'
<checkbox name="«text»" key="«text»" value="«boolean»"/>
-->
<xsl:template name="gui:checkbox"  match="gui:checkbox">
	<a id="{generate-id()}" href="javascript://">
		<xsl:attribute name="class">
			<xsl:text>hui_checkbox</xsl:text>
			<xsl:if test="@value='true'"> hui_checkbox_selected</xsl:if>
		</xsl:attribute>
		<span><span><xsl:comment/></span></span>
		<xsl:value-of select="@title"/>
	</a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkbox({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			'key':'<xsl:value-of select="@key"/>',
			'value':'<xsl:value-of select="@value"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>





<!--doc title:'Check boxes' class:'hui.ui.Checkboxes' module:'input'
<checkboxes name="«text»" key="«text»" max-height="«pixels»">
	<item value="«text»" text="«text»"/>
	<items name="«text»" source="«name»"/>
</checkboxes>
-->
<xsl:template name="gui:checkboxes">
	<div class="hui_checkboxes" id="{generate-id()}">
		<xsl:if test="@max-height"><xsl:attribute name="style">max-height:<xsl:value-of select="@max-height"/>px; overflow: auto;</xsl:attribute></xsl:if>
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkboxes({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			key:'<xsl:value-of select="@key"/>'
		});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:items">
				registerItems(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
			<xsl:for-each select="gui:item">
				registerItem({title:'<xsl:value-of select="@title"/><xsl:value-of select="@text"/>',value:hui.intOrString('<xsl:value-of select="@value"/>')});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:checkboxes/gui:items">
	<span id="{generate-id()}">
		<xsl:comment/>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Checkboxes.Items({element:'<xsl:value-of select="generate-id()"/>',name:'<xsl:value-of select="@name"/>',source:<xsl:value-of select="@source"/>});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:checkboxes/gui:item">
	<a class="hui_checkbox" href="javascript:void(0);">
		<span><span></span></span><xsl:value-of select="@title"/><xsl:value-of select="@text"/>
	</a>
</xsl:template>



<xsl:template match="gui:group/gui:buttons">
	<tr>
		<td colspan="2" style="border-spacing: 0px;">
			<xsl:call-template name="gui:buttons"/>
		</td>
	</tr>
</xsl:template>

<!--doc title:'Buttons' class:'hui.ui.Buttons' module:'action'
<buttons small="«boolean»" mini="«boolean»" aling="«'left' | 'center' | 'right'»" padding="«pixels»" top="«pixels»" left="«pixels»" right="«pixels»" bottom="«pixels»">
	<button···/>
</buttons>
-->
<xsl:template match="gui:buttons" name="gui:buttons">
	<div>
		<xsl:attribute name="class">
			<xsl:text>hui_buttons</xsl:text>
			<xsl:if test="@align='right'">
				<xsl:text> hui_buttons_right</xsl:text>
			</xsl:if>
			<xsl:if test="@align='center'">
				<xsl:text> hui_buttons_center</xsl:text>
			</xsl:if>
		</xsl:attribute>
		<xsl:attribute name="style">
			<xsl:if test="@padding">padding:<xsl:value-of select="@padding"/>px;</xsl:if>
			<xsl:if test="@top">padding-top:<xsl:value-of select="@top"/>px;</xsl:if>
			<xsl:if test="@left">padding-left:<xsl:value-of select="@left"/>px;</xsl:if>
			<xsl:if test="@bottom">padding-bottom:<xsl:value-of select="@bottom"/>px;</xsl:if>
			<xsl:if test="@right">padding-right:<xsl:value-of select="@right"/>px;</xsl:if>
		</xsl:attribute>
		<div class="hui_buttons_body">
			<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>

<!--doc title:'Button' class:'hui.ui.Button' module:'action'
<button text="«text»" icon="«icon»" name="«text»" small="«boolean»" mini="«boolean»" highlighted="«boolean»" disabled="«boolean»" variant="«'paper'»" submit="«boolean»" click="«script»" url="«url»">
    <confirm text="«text»" ok="«text»" cancel="«text»"/>
</button>
-->
<xsl:template match="gui:button" name="gui:button">
	<a id="{generate-id()}" href="javascript://">
		<xsl:attribute name="class">
			<xsl:text>hui_button</xsl:text>
			<xsl:if test="@variant">
				<xsl:text> hui_button_</xsl:text><xsl:value-of select="@variant"/>
			</xsl:if>
			<xsl:if test="@disabled='true'"> hui_button_disabled</xsl:if>
			<xsl:choose>
				<xsl:when test="@variant and @small='true'">
					<xsl:text> hui_button_small_</xsl:text><xsl:value-of select="@variant"/>
				</xsl:when>
				<xsl:when test="@variant and @mini='true'">
					<xsl:text> hui_button_mini_</xsl:text><xsl:value-of select="@variant"/>
				</xsl:when>
				<xsl:when test="@small='true' and @highlighted='true'">
					<xsl:text> hui_button_small hui_button_small_highlighted</xsl:text>
				</xsl:when>
				<xsl:when test="@small='true' or ../@small='true'">
					<xsl:text> hui_button_small</xsl:text>
				</xsl:when>
				<xsl:when test="@highlighted='true'">
					<xsl:text> hui_button_highlighted</xsl:text>
				</xsl:when>
			</xsl:choose>
		</xsl:attribute>
		<span><span>
			<xsl:if test="@icon"><em style="background-image: url('{$context}/hui/icons/{@icon}16.png')">
				<xsl:attribute name="class">
					<xsl:text>hui_button_icon</xsl:text>
					<xsl:if test="(not(@title) or @title='') and (not(@text) or @text='')"><xsl:text> hui_button_icon_notext</xsl:text></xsl:if>
				</xsl:attribute>
				<xsl:comment/>
			</em></xsl:if>
		<xsl:value-of select="@title"/><xsl:value-of select="@text"/>
	</span></span></a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Button({
			element:'<xsl:value-of select="generate-id()"/>'
			<xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
			<xsl:if test="@submit='true'">,submit:true</xsl:if>
			<xsl:if test="gui:confirm">
				,confirm:{text:'<xsl:value-of select="gui:confirm/@text"/>',okText:'<xsl:value-of select="gui:confirm/@ok"/>',cancelText:'<xsl:value-of select="gui:confirm/@cancel"/>'}
			</xsl:if>
		});
		<xsl:if test="@click">
			<xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {<xsl:value-of select="@click"/>}});
		</xsl:if>
		<xsl:if test="@url">
			<xsl:value-of select="generate-id()"/>_obj.listen({$click:function() {document.location='<xsl:value-of select="@url"/>'}});
		</xsl:if>
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:group/gui:button">
	<tr>
		<td colspan="2">
			<xsl:call-template name="gui:button"/>
		</td>
	</tr>
</xsl:template>



<!--doc title:'Image input' class:'hui.ui.ImagePicker' module:'input'
<image-input name="«text»" source="«url»"/>
-->
<xsl:template match="gui:image-input">
	<div class="hui_imagepicker" id="{generate-id()}" tabindex="0"><xsl:comment/></div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ImagePicker({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			source:'<xsl:value-of select="@source"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>



<!--             Tokens            -->


<!--doc title:'Tokens (string list)' class:'hui.ui.TokenField' module:'input'
<tokens name="«text»" key="«text»"/>
-->
<xsl:template name="gui:tokens">
	<div class="hui_tokenfield" id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.TokenField({
			element:'<xsl:value-of select="generate-id()"/>',
			name:'<xsl:value-of select="@name"/>',
			'key':'<xsl:value-of select="@key"/>'}
			);
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--doc title:'Slider' class:'hui.ui.Slider' module:'input'
<slider name="«text»" key="«text»" width="«pixels»"/>
-->
<xsl:template match="gui:slider">
	<span class="hui_slider" id="{generate-id()}">
		<xsl:if	test="@width"><xsl:attribute name="style">width: <xsl:value-of select="@width"/>px;</xsl:attribute></xsl:if>
		<a href="javascript://"><xsl:comment/></a><span><xsl:comment/></span>
	</span>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.Slider({
			element : '<xsl:value-of select="generate-id()"/>',
			name : '<xsl:value-of select="@name"/>',
			'key' : '<xsl:value-of select="@key"/>'
		});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>




<!--doc title:'Object list' class:'hui.ui.ObjectList' module:'input'
<objectlist name="«text»" key="«text»">
    <text key="«text»" label="«text»"/>
    <select key="«text»" label="«text»">
        <option value="«text»" text="«text»"/>
    </select>
</objectlist>
-->
<xsl:template match="gui:objectlist" name="gui:objectlist">
	<table cellspacing="0" cellpadding="0" id="{generate-id()}" class="hui_objectlist">
		<xsl:if test="gui:text/@label">
			<thead>
				<tr>
					<xsl:for-each select="gui:text | gui:select">
						<th class="hui_objectlist hui_objectlist{position()}" style="width: {100 div count(../*)}%;"><xsl:value-of select="@label"/></th>
					</xsl:for-each>
				</tr>
			</thead>
		</xsl:if>
		<tbody>
			<xsl:comment/>
		</tbody>
	</table>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new hui.ui.ObjectList({element:'<xsl:value-of select="generate-id()"/>'
			<xsl:if test="@name">,name:'<xsl:value-of select="@name"/>'</xsl:if>
			,key:'<xsl:value-of select="@key"/>'});
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:apply-templates select="gui:text | gui:select"/>
			ignite();
		}
	</script>
</xsl:template>

<xsl:template match="gui:objectlist/gui:text">
	registerTemplateItem(new hui.ui.ObjectList.Text('<xsl:value-of select="@key"/>'));
</xsl:template>

<xsl:template match="gui:objectlist/gui:select">
	<xsl:variable name="id" select="generate-id()"/>
	var <xsl:value-of select="$id"/> = new hui.ui.ObjectList.Select('<xsl:value-of select="@key"/>');
	<xsl:for-each select="gui:option">
		<xsl:value-of select="$id"/>.addOption('<xsl:value-of select="@value"/>','<xsl:value-of select="@label"/><xsl:value-of select="@text"/>');
	</xsl:for-each>
	registerTemplateItem(<xsl:value-of select="generate-id()"/>);
</xsl:template>

</xsl:stylesheet>