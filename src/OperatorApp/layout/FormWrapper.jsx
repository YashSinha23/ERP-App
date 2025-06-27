import RawMaterialForm from '../forms/RawMaterialForm'
import SheetFormingForm from '../forms/SheetFormingForm'
import CupMoldingForm from '../forms/CupMoldingForm'
import PrintedCupsForm from '../forms/PrintedCupsForm'

const labelMap = {
    raw_material_form: 'Raw Material Form',
    sheet_forming_form: 'Sheet Forming Form',
    cup_molding_form: 'Cup Molding Form',
    printing_form: 'Printed Cups Form'
}

const FormWrapper = ({ selected }) => (
    <div style={{
        marginLeft: '220px',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
        width: '100%',
        overflowY: 'auto'
    }}>
        <h2 style={{ color: '#2C5F2D', marginBottom: '1rem' }}>
            {labelMap[selected]}
        </h2>

        {selected === 'raw_material_form' && <RawMaterialForm />}
        {selected === 'sheet_forming_form' && <SheetFormingForm />}
        {selected === 'cup_molding_form' && <CupMoldingForm />}
        {selected === 'printing_form' && <PrintedCupsForm />}
    </div>
)

export default FormWrapper
