 
          to
          <br />
          your
          {loginMethodUsedByUser === "email" ? "email address" : "phone number"}
        </p>
        {loginMethodUsedByUser === "email" && <h2>{email}</h2>}
        {loginMethodUsedByUser === "phone" && <h2> + 1(373) 383 9933</h2>}