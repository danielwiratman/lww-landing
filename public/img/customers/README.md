# Customer logos

The logos in this folder are the actual customer logos used on the
**Solutions** and **Customers** pages. They are referenced by name in
each solution's front matter under `customers[].logo`, e.g.:

```yaml
customers:
  - name: "Kementerian Pertanian"
    logo: "/img/customers/pertanian.png"
```

## How to use

1. Open `/admin/`, log in with Netlify Identity.
2. Navigate to **Solutions** and edit a solution (e.g. **Data Center**).
3. For each entry under **Selected customers**, click the image picker
   and select a logo from the **Customers** folder.

## When the real high-resolution logos are ready

Drop the final PNG/SVG logos into this folder, then update the customer
records in the CMS to reference them. The Decap CMS can also be used to
upload replacement logos.
