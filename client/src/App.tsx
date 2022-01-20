import React, { useState } from 'react';
import './App.css';
interface TableauAmortissement {
  soldeDebut: Number,
  mensualite: Number,
  interet: Number,
  capitalRembourse: Number,
  soldeFin: Number
}
function App() {
  const [montant, setMontant] = useState<Number>(0.0)
  const [fonds, setFonds] = useState<Number>(0.0)
  const [duree, setDuree] = useState<Number>(0.0)
  const [tauxAnnuel, setTauxAnnuel] = useState<Number>(0.0)
  const [frais, setFrais] = useState<Number | null>(null)
  const [fraisAuto, setFraisAuto] = useState<boolean>(true)

  const [tableau, setTableau] = useState<Array<TableauAmortissement>>([])
  const [montantEmprunter, setMontantEmprunter] = useState<Number | null>(null)
  const [fondsCalculer, setFondsCalculer] = useState<Number | null>(null)
  const [NmontantEmprunter, setNmontantEmprunter] = useState<Number>(0.0)


  const Calculer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8080/Calcul', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        montant,
        fonds,
        duree,
        tauxAnnuel,
        frais: frais ? frais : null
      })
    })
    const json = await res.json()
    setTableau(json.resultat);
    setMontantEmprunter(json.montantEmprunterNet)
  }

  const CalculerNouveauFonds = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8080/CalculFondsPropre', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        montantEmprunterNet:NmontantEmprunter,
        montantAchat:montant,
        frais: frais ? frais : null
      })
    })
    const json = await res.json()
    setFondsCalculer(json.fonds)
  }
  const renderTable = () => {
    return <div className="resultContent">

      <fieldset>
        <legend>Montant d'Emprunter</legend>
        <h3>Valeur actuelle de Montant d'Emprunter: {montantEmprunter}</h3>
        <form onSubmit={e => CalculerNouveauFonds(e)}>
        <div>
          <label htmlFor="montantEmprunter">Montant Emprunter net</label>
          <input required type="number" id="montantEmprunter" value={NmontantEmprunter.toString()} onChange={e => setNmontantEmprunter(Number.parseFloat(e.currentTarget.value))} />
        </div>
        <button type="submit">Calculer</button>
        {fondsCalculer?<h3>Fonds propre pour conserver le montant de l'achat: {fondsCalculer}</h3>:null}
        </form>
      </fieldset>
      <table>
        <thead>
          <tr>
            <th>Période</th>
            <th>Solde début</th>
            <th>Mensualité</th>
            <th>Intérêt</th>
            <th>Capital remboursé</th>
            <th>Solde Fin</th>
          </tr>
        </thead>
        <tbody>
          {
            tableau.map((element, i) => {
              return <tr key={"ligne " + i}>
                <td>{i + 1}</td>
                <td>{element.soldeDebut}</td>
                <td>{element.mensualite}</td>
                <td>{element.interet}</td>
                <td>{element.capitalRembourse}</td>
                <td>{element.soldeFin}</td>
              </tr>
            })
          }
        </tbody>
      </table>
    </div>
  }


  return (
    <div className="App">
      <form className="CalculForm" onSubmit={e => Calculer(e)}>
        <div>
          <label htmlFor="montant">Montant d'achat</label>
          <input required type="number" id="montant" name="montant" value={montant.toString()} onChange={e => setMontant(Number.parseFloat(e.currentTarget.value))} />
        </div>
        <div>
          <label htmlFor="fonds">Les Fonds Propres</label>
          <input required type="number" id="fonds" name="fonds" value={fonds.toString()} onChange={e => setFonds(Number.parseFloat(e.currentTarget.value))} />
        </div>
        <div>
          <label htmlFor="duree">Durée du crédit</label>
          <input required type="number" id="duree" name="duree" value={duree.toString()} onChange={e => setDuree(Number.parseFloat(e.currentTarget.value))} />
        </div>
        <div>
          <label htmlFor="tauxAnnuel">Taux Annuel</label>
          <input required type="number" min="0" max="100" step="0.1" id="tauxAnnuel" name="tauxAnnuel" value={tauxAnnuel.toString()} onChange={e => setTauxAnnuel(Number.parseFloat(e.currentTarget.value))} />
        </div>

        {!fraisAuto ? <div>
          <label htmlFor="frais">Frais</label>
          <input type="number" id="frais" value={frais?.toString()} onChange={e => setFrais(Number.parseFloat(e.target.value))} />
        </div> : null}

        <div>
          <label htmlFor="fraisAuto">fraisAuto</label>
          <input type="checkbox" id="fraisAuto" checked={fraisAuto} onChange={e => {
            setFraisAuto(e.target.checked)
            setFrais(null)
          }} />
        </div>

        <button type="submit">Calculer</button>
      </form>
      {tableau.length !== 0 ? renderTable() : null}
    </div>
  );
}

export default App;
