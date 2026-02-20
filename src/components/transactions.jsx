import { CircularProgressbar, buildStyles }
from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./transactions.css";

export default function Transactions(){

  const active = 6521;
  const expected = 12450;
  const percent = Math.round((active/expected)*100);

  return(
    <div className="card">

      <h2 className="title">Transactions</h2>

      <div className="chartWrapper">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          circleRatio={0.5}
          styles={buildStyles({
            rotation:0.75,
            pathColor:"#8b5cf6",
            trailColor:"#1f2937",
            textColor:"#fff"
          })}
        />
      </div>

      <div className="stats">

        <div>
          <p className="label">Active</p>
          <p className="value">${active}</p>
        </div>

        <div>
          <p className="label">Expected</p>
          <p className="value">${expected}</p>
        </div>

      </div>

    </div>
  )
}
