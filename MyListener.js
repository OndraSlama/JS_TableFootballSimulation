class MyListener extends Box2D.Dynamics.b2ContactListener {
    PreSolve(contact, manifold) {
        let objects = [];
        objects.push(contact.m_fixtureA.GetBody().GetUserData());
        objects.push(contact.m_fixtureB.GetBody().GetUserData());

        for (let o of objects) {
            if (o instanceof Dummy) {
                if (!o.axis.canInteract) {
                    contact.SetEnabled(0);
                }
            }
        }
    }
}